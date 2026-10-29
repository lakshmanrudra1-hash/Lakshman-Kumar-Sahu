import { getAccessToken } from './googleAuth';
import { Order, Reservation } from '../types/cafe';

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  bodyHtml?: string;
  bodyText?: string;
  unread?: boolean;
  labelIds?: string[];
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

/**
 * Helper to encode unicode string into UTF-8 Base64URL without special chars
 */
function toBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * List messages from Gmail API for current authenticated user
 */
export async function listGmailMessages(
  query: string = '',
  maxResults: number = 20
): Promise<GmailMessageItem[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated. Please connect your Google account.');
  }

  const queryParams = new URLSearchParams({
    maxResults: String(maxResults),
  });
  if (query.trim()) {
    queryParams.set('q', query.trim());
  }

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody?.error?.message || `Failed to fetch messages (${res.status} ${res.statusText})`
    );
  }

  const data = await res.json();
  const messagesList: { id: string; threadId: string }[] = data.messages || [];

  if (messagesList.length === 0) {
    return [];
  }

  // Fetch full details for the top batch in parallel
  const detailPromises = messagesList.slice(0, 15).map(async (msg) => {
    try {
      return await getGmailMessageDetails(msg.id);
    } catch (err) {
      console.warn(`Failed to fetch details for message ${msg.id}:`, err);
      return {
        id: msg.id,
        threadId: msg.threadId,
        snippet: 'Message preview unavailable',
        subject: 'No Subject',
      };
    }
  });

  return await Promise.all(detailPromises);
}

/**
 * Fetch full message details including headers and payload
 */
export async function getGmailMessageDetails(messageId: string): Promise<GmailMessageItem> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated. Please connect your Google account.');
  }

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody?.error?.message || `Failed to fetch message ${messageId} (${res.status})`
    );
  }

  const msg = await res.json();
  const headers: GmailMessageHeader[] = msg.payload?.headers || [];

  const getHeader = (name: string): string => {
    const found = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
    return found ? found.value : '';
  };

  const subject = getHeader('Subject') || '(No Subject)';
  const from = getHeader('From') || '(Unknown Sender)';
  const to = getHeader('To') || '';
  const date = getHeader('Date') || '';
  const isUnread = (msg.labelIds || []).includes('UNREAD');

  // Decode body
  let bodyHtml = '';
  let bodyText = '';

  const extractParts = (part: any) => {
    if (!part) return;
    if (part.mimeType === 'text/html' && part.body?.data) {
      bodyHtml = decodeBase64Url(part.body.data);
    } else if (part.mimeType === 'text/plain' && part.body?.data) {
      bodyText = decodeBase64Url(part.body.data);
    }

    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(extractParts);
    }
  };

  if (msg.payload) {
    extractParts(msg.payload);
  }

  return {
    id: msg.id,
    threadId: msg.threadId,
    snippet: msg.snippet || '',
    subject,
    from,
    to,
    date,
    bodyHtml: bodyHtml || (bodyText ? `<pre style="white-space: pre-wrap;">${escapeHtml(bodyText)}</pre>` : `<p>${escapeHtml(msg.snippet || '')}</p>`),
    bodyText: bodyText || msg.snippet,
    unread: isUnread,
    labelIds: msg.labelIds || [],
  };
}

/**
 * Send an email through the user's Gmail account
 * NOTE: User confirmation MUST be obtained before this is called!
 */
export async function sendGmailEmail(payload: SendEmailPayload): Promise<{ id: string; threadId: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated. Please connect your Google account.');
  }

  const utf8Subject = `=?utf-8?B?${toBase64Url(payload.subject)}?=`;

  const emailLines = [
    `To: ${payload.to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    payload.htmlBody,
  ];

  const rawMime = emailLines.join('\r\n');
  const base64Raw = toBase64Url(rawMime);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64Raw,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody?.error?.message || `Failed to send email (${res.status} ${res.statusText})`
    );
  }

  return await res.json();
}

/**
 * Trash an email message
 * NOTE: Explicit user confirmation MUST be obtained before calling!
 */
export async function trashGmailMessage(messageId: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated. Please connect your Google account.');
  }

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody?.error?.message || `Failed to trash email (${res.status})`
    );
  }

  return true;
}

/**
 * Base64URL decoder helper for message bodies
 */
function decodeBase64Url(base64UrlStr: string): string {
  try {
    let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err) {
    console.error('Base64URL decoding failed:', err);
    return '';
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================
   CAFE EMAIL TEMPLATES
   ========================================================== */

export function generateOrderReceiptHtml(order: Order, cafeName: string = "Sanny's Kitchen"): { subject: string; html: string } {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #3b251a;">
        <td style="padding: 10px 0; color: #fdfbf7;">
          <strong>${escapeHtml(item.menuItem.name)}</strong> × ${item.quantity}
          ${
            item.options.size || item.options.temperature || item.options.milk
              ? `<br><small style="color: #decbba;">${[
                  item.options.size,
                  item.options.temperature,
                  item.options.milk,
                  item.options.extras?.join(', '),
                ]
                  .filter(Boolean)
                  .join(' • ')}</small>`
              : ''
          }
        </td>
        <td style="padding: 10px 0; text-align: right; color: #e2b767; font-weight: bold;">
          ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>`
    )
    .join('');

  const subject = `Order Confirmed #${order.orderNumber} - ${cafeName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #0d0704; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #fdfbf7;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #1a100a; border: 1px solid #b87b42; border-radius: 12px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <div style="text-align: center; border-bottom: 1px solid #3b251a; padding-bottom: 18px; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #e2b767; font-size: 24px; letter-spacing: 1px;">${escapeHtml(cafeName)}</h1>
            <p style="margin: 5px 0 0; color: #decbba; font-size: 13px;">Artisanal Roastery & Kitchen • Order Receipt</p>
          </div>

          <p style="font-size: 15px; margin: 0 0 12px;">Hello <strong>${escapeHtml(order.customerName)}</strong>,</p>
          <p style="font-size: 14px; color: #ede2d3; line-height: 1.5; margin: 0 0 20px;">
            Thank you for dining with us! Your order <strong>#${escapeHtml(order.orderNumber)}</strong> has been received and our kitchen has started handcrafting your artisanal order.
          </p>

          <div style="background-color: #261811; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
            <div style="font-size: 12px; color: #decbba; text-transform: uppercase; letter-spacing: 0.5px;">Dining Details</div>
            <div style="font-size: 14px; font-weight: bold; color: #fdfbf7; margin-top: 4px;">
              ${order.diningType.toUpperCase()} • ${escapeHtml(order.tableOrAddress || 'Main Hall')}
            </div>
            <div style="font-size: 12px; color: #e2b767; margin-top: 4px;">
              Estimated Preparation: ~${order.estimatedMinutes} minutes
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="border-bottom: 2px solid #b87b42;">
                <th style="text-align: left; padding-bottom: 8px; color: #decbba; font-size: 12px; text-transform: uppercase;">Item</th>
                <th style="text-align: right; padding-bottom: 8px; color: #decbba; font-size: 12px; text-transform: uppercase;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="border-top: 1px solid #3b251a; padding-top: 14px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #decbba;">
              <span>Subtotal</span>
              <span style="float: right;">₹${order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #decbba;">
              <span>Taxes & Kitchen Service</span>
              <span style="float: right;">₹${order.tax.toLocaleString('en-IN')}</span>
            </div>
            ${
              order.tip > 0
                ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #decbba;">
                    <span>Barista Tip</span>
                    <span style="float: right;">₹${order.tip.toLocaleString('en-IN')}</span>
                  </div>`
                : ''
            }
            <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #b87b42; font-size: 18px; font-weight: bold; color: #e2b767;">
              <span>Total Paid</span>
              <span style="float: right;">₹${order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3b251a; color: #9e6431; font-size: 12px;">
            <p style="margin: 0;">${escapeHtml(cafeName)} • Artisanal Hearth & Coffee</p>
            <p style="margin: 4px 0 0;">Need help? Call our barista hotline at +91 98450 12345</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

export function generateReservationReceiptHtml(reservation: Reservation, cafeName: string = "Sanny's Kitchen"): { subject: string; html: string } {
  const subject = `Table Reservation Confirmed: ${reservation.bookingCode} - ${cafeName}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 20px; background-color: #0d0704; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #fdfbf7;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #1a100a; border: 1px solid #b87b42; border-radius: 12px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <div style="text-align: center; border-bottom: 1px solid #3b251a; padding-bottom: 18px; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #e2b767; font-size: 24px;">${escapeHtml(cafeName)}</h1>
            <p style="margin: 5px 0 0; color: #decbba; font-size: 13px;">Table Booking Confirmation</p>
          </div>

          <p style="font-size: 15px; margin: 0 0 12px;">Dear <strong>${escapeHtml(reservation.customerName)}</strong>,</p>
          <p style="font-size: 14px; color: #ede2d3; line-height: 1.5; margin: 0 0 20px;">
            We are delighted to confirm your table reservation at ${escapeHtml(cafeName)}. Your dedicated table will be ready upon your arrival.
          </p>

          <div style="background-color: #261811; border-radius: 10px; padding: 18px; margin-bottom: 20px; border-left: 4px solid #e2b767;">
            <div style="font-size: 12px; color: #decbba; text-transform: uppercase;">Booking Code</div>
            <div style="font-size: 20px; font-weight: bold; color: #e2b767; font-family: monospace; letter-spacing: 2px; margin-top: 4px;">
              ${escapeHtml(reservation.bookingCode)}
            </div>
            
            <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
              <div>
                <span style="color: #decbba; font-size: 12px; display: block;">Date:</span>
                <strong>${reservation.date}</strong>
              </div>
              <div>
                <span style="color: #decbba; font-size: 12px; display: block;">Time Slot:</span>
                <strong>${reservation.timeSlot}</strong>
              </div>
              <div>
                <span style="color: #decbba; font-size: 12px; display: block;">Guests:</span>
                <strong>${reservation.guests} People</strong>
              </div>
              <div>
                <span style="color: #decbba; font-size: 12px; display: block;">Area / Seating:</span>
                <strong>${escapeHtml(reservation.area)}</strong>
              </div>
            </div>

            ${
              reservation.specialRequest
                ? `<div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #3b251a; font-size: 13px; color: #ede2d3;">
                    <span style="color: #decbba;">Special Request:</span> ${escapeHtml(reservation.specialRequest)}
                  </div>`
                : ''
            }
          </div>

          <p style="font-size: 13px; color: #decbba; line-height: 1.4;">
            Please arrive within 15 minutes of your reserved time. If your plans change, feel free to reply directly to this email or call our host at +91 98450 12345.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #3b251a; color: #9e6431; font-size: 12px;">
            <p style="margin: 0;">${escapeHtml(cafeName)} • Artisanal Roastery & Kitchen</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

export function generateSupplierInquiryHtml(
  supplierName: string,
  itemsList: { name: string; requiredQty: number; unit: string }[],
  cafeName: string = "Sanny's Kitchen"
): { subject: string; html: string } {
  const subject = `Urgent Stock Reorder / Quote Request - ${cafeName}`;

  const rows = itemsList
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #3b251a;">
        <td style="padding: 8px 0; color: #fdfbf7;"><strong>${escapeHtml(item.name)}</strong></td>
        <td style="padding: 8px 0; text-align: right; color: #e2b767; font-weight: bold;">
          ${item.requiredQty} ${escapeHtml(item.unit)}
        </td>
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 20px; background-color: #0d0704; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #fdfbf7;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #1a100a; border: 1px solid #b87b42; border-radius: 12px; padding: 28px;">
          <h2 style="margin: 0 0 10px; color: #e2b767;">Purchase Order Request</h2>
          <p style="color: #decbba; font-size: 14px; margin: 0 0 18px;">
            To: ${escapeHtml(supplierName || 'Procurement Team')}
          </p>
          <p style="color: #fdfbf7; font-size: 14px; line-height: 1.5; margin: 0 0 16px;">
            Greetings from ${escapeHtml(cafeName)}. We are running low on our kitchen inventory and would like to request an expedited restock quotation and delivery schedule for the following items:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="border-bottom: 2px solid #b87b42;">
                <th style="text-align: left; padding-bottom: 6px; color: #decbba; font-size: 12px;">Ingredient</th>
                <th style="text-align: right; padding-bottom: 6px; color: #decbba; font-size: 12px;">Requested Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <p style="color: #decbba; font-size: 13px;">
            Please reply with dispatch timeline and invoice total.
          </p>
          <p style="margin-top: 20px; color: #e2b767; font-size: 13px; font-weight: bold;">
            — Kitchen Management, ${escapeHtml(cafeName)}
          </p>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}
