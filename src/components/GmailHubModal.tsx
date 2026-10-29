import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Mail,
  Send,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
  Inbox,
  User,
  Coffee,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/googleAuth';
import {
  listGmailMessages,
  getGmailMessageDetails,
  sendGmailEmail,
  trashGmailMessage,
  GmailMessageItem,
  generateOrderReceiptHtml,
  generateReservationReceiptHtml,
  generateSupplierInquiryHtml,
} from '../services/gmailService';
import { useCafe } from '../context/CafeContext';

interface GmailHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultComposeTab?: boolean;
  initialOrderForReceipt?: any;
  initialReservationForConfirm?: any;
}

export const GmailHubModal: React.FC<GmailHubModalProps> = ({
  isOpen,
  onClose,
  defaultComposeTab = false,
  initialOrderForReceipt = null,
  initialReservationForConfirm = null,
}) => {
  const { orders, reservations, inventory, settings } = useCafe();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'inbox' | 'compose' | 'sent'
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'sent'>('inbox');

  // Messages list state
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageItem | null>(null);

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');

  // Mandatory Confirmation Dialog State (for destructive or mutating operations: sending emails or trashing)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'send_email' | 'trash_message';
    title: string;
    description: string;
    targetData?: any;
  }>({
    isOpen: false,
    type: 'send_email',
    title: '',
    description: '',
  });

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Initialize Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAuthToken(token);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
        setAuthToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Fetch messages when authenticated
  const fetchMessages = useCallback(
    async (query: string = '', tab: 'inbox' | 'sent' = activeTab === 'sent' ? 'sent' : 'inbox') => {
      if (!authToken) return;
      setIsLoadingMessages(true);
      setActionErrorMsg(null);
      try {
        let finalQuery = query;
        if (tab === 'sent') {
          finalQuery = query ? `in:sent ${query}` : 'in:sent';
        } else if (!query) {
          finalQuery = 'in:inbox';
        }
        const list = await listGmailMessages(finalQuery, 15);
        setMessages(list);
      } catch (err: any) {
        console.error('Error fetching Gmail messages:', err);
        setActionErrorMsg(err.message || 'Failed to load messages from Gmail.');
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [authToken, activeTab]
  );

  // Load messages on modal open or auth change
  useEffect(() => {
    if (isOpen && authToken) {
      fetchMessages(searchQuery, activeTab === 'sent' ? 'sent' : 'inbox');
    }
  }, [isOpen, authToken, activeTab, fetchMessages]);

  // Handle template pre-filling when passed via props
  useEffect(() => {
    if (defaultComposeTab) {
      setActiveTab('compose');
    }
    if (initialOrderForReceipt) {
      setActiveTab('compose');
      setSelectedTemplate('order');
      const { subject, html } = generateOrderReceiptHtml(initialOrderForReceipt, settings.cafeName);
      setComposeTo(initialOrderForReceipt.customerEmail || '');
      setComposeSubject(subject);
      setComposeBody(html);
    } else if (initialReservationForConfirm) {
      setActiveTab('compose');
      setSelectedTemplate('reservation');
      const { subject, html } = generateReservationReceiptHtml(initialReservationForConfirm, settings.cafeName);
      setComposeTo(initialReservationForConfirm.customerEmail || '');
      setComposeSubject(subject);
      setComposeBody(html);
    }
  }, [defaultComposeTab, initialOrderForReceipt, initialReservationForConfirm, settings.cafeName]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAuthToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setAuthError(err.message || 'Google sign-in was not completed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setAuthToken(null);
    setMessages([]);
    setSelectedMessage(null);
  };

  // Switch template generator
  const handleSelectTemplate = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (templateKey === 'order') {
      const latestOrder = orders[0];
      if (latestOrder) {
        const { subject, html } = generateOrderReceiptHtml(latestOrder, settings.cafeName);
        setComposeSubject(subject);
        setComposeBody(html);
      }
    } else if (templateKey === 'reservation') {
      const latestReservation = reservations[0];
      if (latestReservation) {
        const { subject, html } = generateReservationReceiptHtml(latestReservation, settings.cafeName);
        setComposeTo(latestReservation.customerEmail);
        setComposeSubject(subject);
        setComposeBody(html);
      }
    } else if (templateKey === 'supplier') {
      const lowStock = inventory.filter((i) => i.currentStock <= i.reorderLevel);
      const itemsToOrder = (lowStock.length > 0 ? lowStock : inventory.slice(0, 3)).map((i) => ({
        name: i.name,
        requiredQty: i.reorderLevel * 2,
        unit: i.unit,
      }));
      const supplierName = lowStock[0]?.supplier || 'Artisanal Supply Co.';
      const { subject, html } = generateSupplierInquiryHtml(supplierName, itemsToOrder, settings.cafeName);
      setComposeSubject(subject);
      setComposeBody(html);
    } else if (templateKey === 'custom') {
      setComposeSubject(`A message from ${settings.cafeName}`);
      setComposeBody(
        `<p>Dear Valued Guest,</p><p>We would love to welcome you back to ${settings.cafeName}. Let us know if you need assistance with special events or table reservations.</p><p>Warm regards,<br>The Kitchen Team</p>`
      );
    }
  };

  // STEP 1: User clicks "Send Email" -> Opens Mandatory Confirmation Dialog
  const handleTriggerSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim()) {
      setActionErrorMsg('Please specify a recipient email address.');
      return;
    }
    if (!composeSubject.trim()) {
      setActionErrorMsg('Please specify an email subject.');
      return;
    }

    setConfirmationModal({
      isOpen: true,
      type: 'send_email',
      title: 'Confirm Sending Email via Gmail',
      description: `You are about to send an email to "${composeTo}" with the subject "${composeSubject}" from your authenticated Gmail account (${currentUser?.email}).`,
      targetData: {
        to: composeTo.trim(),
        subject: composeSubject.trim(),
        htmlBody: composeBody,
      },
    });
  };

  // STEP 1b: User clicks "Trash Email" -> Opens Mandatory Confirmation Dialog
  const handleTriggerTrashEmail = (msg: GmailMessageItem) => {
    setConfirmationModal({
      isOpen: true,
      type: 'trash_message',
      title: 'Move Email to Trash?',
      description: `Are you sure you want to move the email "${msg.subject}" from "${msg.from}" to your Gmail Trash?`,
      targetData: msg,
    });
  };

  // STEP 2: Explicit Confirmation Action (User confirmed through modal)
  const handleExecuteConfirmedAction = async () => {
    const { type, targetData } = confirmationModal;
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    if (type === 'send_email') {
      setIsSending(true);
      try {
        await sendGmailEmail({
          to: targetData.to,
          subject: targetData.subject,
          htmlBody: targetData.htmlBody,
        });
        setActionSuccessMsg(`Email successfully sent to ${targetData.to}!`);
        // Reset compose
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        // Switch to inbox or sent
        setTimeout(() => {
          fetchMessages('', 'sent');
        }, 1000);
      } catch (err: any) {
        console.error('Failed to send email:', err);
        setActionErrorMsg(err.message || 'Failed to dispatch email via Gmail.');
      } finally {
        setIsSending(false);
      }
    } else if (type === 'trash_message') {
      try {
        await trashGmailMessage(targetData.id);
        setActionSuccessMsg(`Email moved to Trash.`);
        setMessages((prev) => prev.filter((m) => m.id !== targetData.id));
        if (selectedMessage?.id === targetData.id) {
          setSelectedMessage(null);
        }
      } catch (err: any) {
        console.error('Failed to trash email:', err);
        setActionErrorMsg(err.message || 'Failed to move email to trash.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Main Glassmorphic Modal Window */}
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[760px] glass-panel-warm rounded-2xl border border-[#E2B767]/30 shadow-2xl flex flex-col overflow-hidden text-[#FAF6F0]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#FAF6F0]/10 bg-[#150D09]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EA4335] via-[#B87B42] to-[#E2B767] p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#120B07] rounded-[10px] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#E2B767]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#FDFBF7]">
                  Gmail Kitchen Communications Hub
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#B87B42]/30 text-[#E2B767] border border-[#E2B767]/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-[#DEC4AB]">
                Order receipts, table confirmations, supplier quotes & customer correspondence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User status badge or sign in button */}
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#261811] border border-[#E2B767]/30 text-xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-[#E2B767]" />
                )}
                <span className="font-medium text-[#FDFBF7] max-w-[130px] truncate">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-[11px] text-[#DEC4AB] hover:text-[#EA4335] ml-1 transition-colors cursor-pointer"
                  title="Sign out of Google"
                >
                  Disconnect
                </button>
              </div>
            ) : null}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#261811] hover:bg-[#3B251A] text-white/70 hover:text-white transition-all cursor-pointer border border-[#E2B767]/20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notifications inside Hub */}
        {actionSuccessMsg && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              {actionSuccessMsg}
            </span>
            <button
              onClick={() => setActionSuccessMsg(null)}
              className="text-emerald-400 hover:text-emerald-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {actionErrorMsg && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              {actionErrorMsg}
            </span>
            <button
              onClick={() => setActionErrorMsg(null)}
              className="text-red-400 hover:text-red-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Auth Gate: When not signed in */}
        {!currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#100906]">
            <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-[#E2B767]/25 space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#261811] border border-[#E2B767]/40 flex items-center justify-center mx-auto text-[#E2B767] shadow-inner">
                <Mail className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#FDFBF7]">
                  Connect Sanny's Kitchen to Gmail
                </h3>
                <p className="text-xs text-[#DEC4AB] mt-2 leading-relaxed">
                  Sign in with Google to send automated order receipts, confirm table bookings, manage supplier quotes, and view restaurant communications directly in your app.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-200 text-xs text-left">
                  {authError}
                </div>
              )}

              {/* Official Google Sign-In Button */}
              <div className="flex flex-col items-center justify-center pt-2">
                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="gsi-material-button w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-semibold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#1f1f1f',
                    border: '1px solid #747775',
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span>{isAuthenticating ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#A68875] pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E2B767]" />
                <span>Authorized via official Google OAuth with end-to-end security</span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Workspace View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Sidebar / Nav */}
            <div className="w-full md:w-60 bg-[#120B07] border-b md:border-b-0 md:border-r border-[#FAF6F0]/10 p-4 flex flex-col gap-2 shrink-0">
              
              <button
                onClick={() => {
                  setActiveTab('compose');
                  setSelectedMessage(null);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                  activeTab === 'compose'
                    ? 'bg-gradient-to-r from-[#B87B42] to-[#E2B767] text-[#120B07]'
                    : 'bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07]'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compose / Send Email</span>
              </button>

              <div className="h-px bg-white/10 my-2" />

              <button
                onClick={() => {
                  setActiveTab('inbox');
                  fetchMessages('', 'inbox');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'inbox'
                    ? 'bg-[#261811] text-[#E2B767] border border-[#E2B767]/30'
                    : 'text-[#DEC4AB] hover:bg-[#1E130D] hover:text-[#FAF6F0]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Inbox</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#3B251A] text-[10px] text-[#E2B767] font-bold">
                  {messages.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('sent');
                  fetchMessages('', 'sent');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'sent'
                    ? 'bg-[#261811] text-[#E2B767] border border-[#E2B767]/30'
                    : 'text-[#DEC4AB] hover:bg-[#1E130D] hover:text-[#FAF6F0]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Send className="w-4 h-4" />
                  <span>Sent Mails</span>
                </span>
              </button>

              {/* Cafe Quick Actions */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A68875] px-2 block mb-2">
                  Kitchen Dispatch
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('compose');
                      handleSelectTemplate('order');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-[#DEC4AB] hover:text-[#E2B767] hover:bg-[#261811] transition-colors flex items-center gap-2"
                  >
                    <Coffee className="w-3.5 h-3.5 text-[#E2B767]" />
                    <span>Send Order Receipt</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('compose');
                      handleSelectTemplate('reservation');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-[#DEC4AB] hover:text-[#E2B767] hover:bg-[#261811] transition-colors flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#E2B767]" />
                    <span>Table Confirmation</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('compose');
                      handleSelectTemplate('supplier');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-[#DEC4AB] hover:text-[#E2B767] hover:bg-[#261811] transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E2B767]" />
                    <span>Supplier Quote Request</span>
                  </button>
                </div>
              </div>

              {/* Status pill at bottom */}
              <div className="mt-auto pt-3 border-t border-white/10 text-[10px] text-[#A68875] flex items-center gap-2 px-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected as {currentUser?.displayName || 'Owner'}</span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0D0704]/90">
              
              {/* TAB: COMPOSE */}
              {activeTab === 'compose' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#FAF6F0]/10">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#FDFBF7] flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#E2B767]" />
                        <span>Compose Email</span>
                      </h3>
                      <p className="text-xs text-[#DEC4AB]">
                        Send official emails on behalf of {settings.cafeName}
                      </p>
                    </div>

                    {/* Template Picker */}
                    <div className="flex items-center gap-1.5 bg-[#261811] p-1 rounded-xl border border-[#E2B767]/20">
                      <span className="text-[10px] text-[#A68875] px-2 font-semibold uppercase">Template:</span>
                      <button
                        type="button"
                        onClick={() => handleSelectTemplate('order')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          selectedTemplate === 'order' ? 'bg-[#B87B42] text-white' : 'text-[#DEC4AB] hover:text-white'
                        }`}
                      >
                        Order Receipt
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTemplate('reservation')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          selectedTemplate === 'reservation' ? 'bg-[#B87B42] text-white' : 'text-[#DEC4AB] hover:text-white'
                        }`}
                      >
                        Reservation
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTemplate('supplier')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          selectedTemplate === 'supplier' ? 'bg-[#B87B42] text-white' : 'text-[#DEC4AB] hover:text-white'
                        }`}
                      >
                        Supplier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectTemplate('custom')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          selectedTemplate === 'custom' ? 'bg-[#B87B42] text-white' : 'text-[#DEC4AB] hover:text-white'
                        }`}
                      >
                        Blank
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleTriggerSendEmail} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#DEC4AB] mb-1">
                          Recipient Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={composeTo}
                          onChange={(e) => setComposeTo(e.target.value)}
                          placeholder="e.g. customer@example.com or supplier@coffeeco.com"
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#FDFBF7]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#DEC4AB] mb-1">
                          Subject Line <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={composeSubject}
                          onChange={(e) => setComposeSubject(e.target.value)}
                          placeholder="e.g. Order Confirmed #SK-401 - Sanny's Kitchen"
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#FDFBF7]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-[#DEC4AB]">
                          Message Body (HTML / Formatted Content)
                        </label>
                        <span className="text-[10px] text-[#A68875]">Supports HTML & inline styling</span>
                      </div>
                      <textarea
                        rows={7}
                        value={composeBody}
                        onChange={(e) => setComposeBody(e.target.value)}
                        placeholder="Write your email message here..."
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-xs text-[#FDFBF7] leading-relaxed"
                      />
                    </div>

                    {/* Live Preview Accordion */}
                    {composeBody && (
                      <div className="p-4 rounded-xl bg-[#1A100A] border border-[#E2B767]/20">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#E2B767] block mb-2">
                          Live Render Preview
                        </span>
                        <div
                          className="max-h-48 overflow-y-auto p-3 rounded-lg bg-[#0D0704] text-xs border border-white/5"
                          dangerouslySetInnerHTML={{ __html: composeBody }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setComposeTo('');
                          setComposeSubject('');
                          setComposeBody('');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-[#DEC4AB] hover:text-white bg-[#261811] hover:bg-[#3B251A] transition-all cursor-pointer"
                      >
                        Reset Form
                      </button>
                      <button
                        type="submit"
                        disabled={isSending || !composeTo || !composeSubject}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSending ? 'Sending...' : 'Review & Send via Gmail'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: INBOX OR SENT */}
              {(activeTab === 'inbox' || activeTab === 'sent') && (
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* Message List */}
                  <div className={`w-full ${selectedMessage ? 'md:w-1/2' : 'w-full'} flex flex-col border-r border-[#FAF6F0]/10 overflow-hidden`}>
                    
                    {/* Search & Refresh Bar */}
                    <div className="p-3 bg-[#150D09] border-b border-[#FAF6F0]/10 flex items-center gap-2 shrink-0">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-[#DEC4AB] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') fetchMessages(searchQuery, activeTab);
                          }}
                          placeholder={`Search ${activeTab === 'sent' ? 'sent emails' : 'inbox'}... (press Enter)`}
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg glass-input text-[#FAF6F0]"
                        />
                      </div>
                      <button
                        onClick={() => fetchMessages(searchQuery, activeTab)}
                        disabled={isLoadingMessages}
                        className="p-2 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-[#E2B767] border border-[#E2B767]/20 transition-all cursor-pointer disabled:opacity-50"
                        title="Refresh Messages"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto divide-y divide-[#FAF6F0]/5">
                      {isLoadingMessages ? (
                        <div className="p-12 text-center text-[#DEC4AB] space-y-3">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#E2B767] mx-auto" />
                          <p className="text-xs">Fetching messages from Gmail...</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="p-12 text-center text-[#DEC4AB] space-y-2">
                          <Mail className="w-8 h-8 text-[#A68875] mx-auto opacity-50" />
                          <p className="text-xs font-medium">No messages found in {activeTab}.</p>
                          <p className="text-[11px] text-[#A68875]">Try adjusting your search query or refreshing.</p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => setSelectedMessage(msg)}
                            className={`p-3.5 hover:bg-[#261811]/70 transition-all cursor-pointer group flex items-start gap-3 ${
                              selectedMessage?.id === msg.id ? 'bg-[#261811] border-l-2 border-[#E2B767]' : ''
                            } ${msg.unread ? 'font-semibold text-white' : 'text-[#DEC4AB]'}`}
                          >
                            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#E2B767] opacity-80" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <span className="text-xs font-bold text-[#FDFBF7] truncate">
                                  {activeTab === 'sent' ? `To: ${msg.to || 'Recipient'}` : msg.from?.split('<')[0]?.trim() || msg.from}
                                </span>
                                <span className="text-[10px] text-[#A68875] shrink-0">{msg.date?.split(' ').slice(0, 4).join(' ')}</span>
                              </div>
                              <p className="text-xs text-[#E2B767] truncate font-medium">
                                {msg.subject || '(No Subject)'}
                              </p>
                              <p className="text-[11px] text-[#DEC4AB]/70 line-clamp-1 mt-0.5">
                                {msg.snippet}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#E2B767] shrink-0 mt-1" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Message Detail Pane */}
                  {selectedMessage ? (
                    <div className="w-full md:w-1/2 flex flex-col bg-[#120B07] overflow-hidden">
                      <div className="p-4 border-b border-[#FAF6F0]/10 bg-[#170E09] flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-sm text-[#FDFBF7] truncate">
                            {selectedMessage.subject}
                          </h4>
                          <p className="text-[11px] text-[#DEC4AB] truncate">
                            From: {selectedMessage.from}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTriggerTrashEmail(selectedMessage)}
                            className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                            title="Move to Trash"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('compose');
                              setComposeTo(selectedMessage.from ? (selectedMessage.from.match(/<([^>]+)>/)?.[1] || selectedMessage.from) : '');
                              setComposeSubject(`Re: ${selectedMessage.subject || ''}`);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-xs font-semibold text-[#E2B767] border border-[#E2B767]/30 transition-all cursor-pointer"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => setSelectedMessage(null)}
                            className="p-1.5 rounded-lg text-white/50 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 text-xs text-[#FAF6F0] space-y-4">
                        <div className="p-3 rounded-xl bg-[#1D120B] border border-white/5 space-y-1 text-[11px]">
                          <div><span className="text-[#A68875]">Date:</span> {selectedMessage.date}</div>
                          <div><span className="text-[#A68875]">To:</span> {selectedMessage.to}</div>
                        </div>

                        {/* Rendered HTML or formatted body */}
                        <div
                          className="p-4 rounded-xl bg-[#0D0704] border border-white/10 leading-relaxed text-xs overflow-x-auto text-[#EDE2D3]"
                          dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml || selectedMessage.bodyText || '' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center p-8 text-center text-[#A68875] text-xs">
                      Select an email to view full conversation and kitchen details
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG (Required by Workspace Integration Skill for Mutating Operations) */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md glass-panel-warm p-6 rounded-2xl border border-[#E2B767] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B87B42]/30 border border-[#E2B767] flex items-center justify-center shrink-0 text-[#E2B767]">
                <AlertTriangle className="w-5 h-5 text-[#E2B767]" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-serif font-bold text-[#FDFBF7]">
                  {confirmationModal.title}
                </h3>
                <p className="text-xs text-[#DEC4AB] mt-1.5 leading-relaxed">
                  {confirmationModal.description}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#120B07] border border-white/10 text-[11px] text-[#A68875] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E2B767] shrink-0" />
              <span>This operation will be performed with permission using your authenticated Gmail credentials.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmationModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#DEC4AB] hover:text-white bg-[#261811] hover:bg-[#3B251A] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedAction}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] transition-all cursor-pointer shadow-md"
              >
                {confirmationModal.type === 'trash_message' ? 'Yes, Trash Email' : 'Yes, Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
