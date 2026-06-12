import { useState, useEffect, useRef } from 'react';
import { useMessages } from '../../contexts/MessageContext';
import { useOnlineStatus } from '../../contexts/OnlineStatusContext';
import StatusDot from '../../components/ui/StatusDot';
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, MessageSquare, Smile, Cloud } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import PaginationControls from '../../components/ui/PaginationControls';

const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMins = Math.floor((now - date) / (1000 * 60));
    return diffInMins <= 0 ? 'Just now' : `${diffInMins}m ago`;
  }
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export default function MessagesPage() {
  const { conversations, sendMessage, markConversationAsRead, hasLocalMigration, migrateLocalMessages } = useMessages();
  const { getUserStatus, formatLastSeen } = useOnlineStatus();
  const [activeConvId, setActiveConvId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const activeConversation = conversations.find(c => c.id === activeConvId);

  const filteredConversations = conversations.filter(c => 
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConversations.length / limit) || 1;
  const paginatedConversations = filteredConversations.slice((currentPage - 1) * limit, currentPage * limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    if (activeConvId) {
      markConversationAsRead(activeConvId);
      scrollToBottom();
    }
  }, [activeConvId, conversations, markConversationAsRead]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;
    sendMessage(activeConvId, messageInput.trim());
    setMessageInput('');
  };

  // Get status info for active conversation participant
  const activeStatus = activeConversation
    ? getUserStatus(activeConversation.participant.name)
    : null;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F8FAFC]">
      {/* LEFT SIDEBAR - CONVERSATION LIST */}
      <div className={`w-full md:w-[350px] lg:w-[400px] flex flex-col bg-white border-r border-slate-200 shrink-0 h-full ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Messages</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Connect and collaborate with teammates.</p>
            </div>
          </div>

          {hasLocalMigration && (
            <div className="mb-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
              <h3 className="text-[13px] font-bold text-slate-900">Local Messages Found</h3>
              <p className="text-[12px] text-slate-600 font-medium mb-2">You have legacy local messages. Migrate to cloud to access everywhere.</p>
              <button 
                onClick={migrateLocalMessages}
                className="w-full bg-[#6C4CF1] hover:bg-indigo-600 text-white py-1.5 rounded-md text-[12px] font-bold transition-colors flex justify-center items-center gap-1.5"
              >
                <Cloud size={14} />
                Migrate to Cloud
              </button>
            </div>
          )}
          
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search conversations"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder-slate-400 focus:bg-white focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1">
            {paginatedConversations.length > 0 ? (
              paginatedConversations.map((conv) => {
                const { status } = getUserStatus(conv.participant.name);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-4 flex items-start gap-4 transition-colors border-b border-slate-50 relative ${activeConvId === conv.id ? 'bg-[#F4F2FF]' : 'hover:bg-slate-50'}`}
                  >
                    {activeConvId === conv.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6C4CF1]" />
                    )}
                    
                    {/* Avatar with status dot */}
                    <div className="relative shrink-0">
                      <img src={conv.participant.avatar} alt={conv.participant.name} className="w-12 h-12 rounded-full border border-slate-200 object-cover bg-white" />
                      {/* Status dot bottom-right of avatar */}
                      <span className="absolute bottom-0 right-0 ring-2 ring-white rounded-full">
                        <StatusDot status={status} size="md" />
                      </span>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full z-10" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm truncate pr-2 ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                          {conv.participant.name}
                        </h3>
                        <span className={`text-[11px] shrink-0 ${conv.unreadCount > 0 ? 'font-bold text-[#6C4CF1]' : 'font-medium text-slate-400'}`}>
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className={`text-[13px] truncate ${conv.unreadCount > 0 ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#6C4CF1] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full">
                        {conv.unreadCount}
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4">
                <EmptyState
                  icon={Search}
                  title="No results"
                  description={`No conversations matching "${searchQuery}".`}
                  actionText="Clear search"
                  onAction={() => setSearchQuery('')}
                  variant="compact"
                />
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-slate-100 bg-slate-50 shrink-0">
            <PaginationControls 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - CHAT WINDOW */}
      <div className={`flex-1 flex flex-col bg-white h-full relative ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-[72px] px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveConvId(null)}
                  aria-label="Back to conversations"
                  className="md:hidden p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-lg focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative shrink-0">
                  <img src={activeConversation.participant.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200 object-cover bg-slate-50" />
                  <span className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white rounded-full">
                    <StatusDot status={activeStatus?.status} size="md" />
                  </span>
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 leading-tight">{activeConversation.participant.name}</h2>
                  {activeStatus?.status === 'online' && (
                    <p className="text-[12px] font-semibold text-emerald-500 flex items-center gap-1.5 mt-0.5">
                      Online
                    </p>
                  )}
                  {activeStatus?.status === 'away' && (
                    <p className="text-[12px] font-semibold text-amber-500 mt-0.5">Away</p>
                  )}
                  {activeStatus?.status === 'offline' && activeStatus?.lastSeen && (
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                      Last seen {formatLastSeen(activeStatus.lastSeen)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400">
                <button aria-label="Start voice call" className="p-2 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors hidden sm:block focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none">
                  <Phone size={18} />
                </button>
                <button aria-label="Start video call" className="p-2 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors hidden sm:block focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none">
                  <Video size={18} />
                </button>
                <button aria-label="More options" className="p-2 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
              <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div key={msg.id} className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`px-4 py-2.5 rounded-2xl shadow-sm text-[14.5px] leading-relaxed ${
                            isMe 
                              ? 'bg-[#6C4CF1] text-white rounded-br-sm' 
                              : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium mt-1.5 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-5 border-t border-slate-100 bg-white shrink-0">
              <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative flex items-center">
                <button type="button" aria-label="Add emoji" className="absolute left-3 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none">
                  <Smile size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  aria-label="Type a message"
                  className="w-full pl-12 pr-14 py-3.5 bg-[#F8FAFC] border border-transparent rounded-xl text-[14px] font-medium placeholder-slate-400 focus:bg-white focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="absolute right-2.5 w-9 h-9 flex items-center justify-center bg-[#6C4CF1] text-white rounded-lg hover:bg-[#6C4CF1] disabled:opacity-50 disabled:hover:bg-[#6C4CF1] transition-colors"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#F4F2FF] flex items-center justify-center mb-4">
              <MessageSquare size={36} strokeWidth={1.5} className="text-[#6C4CF1]" />
            </div>
            <h3 className="text-[18px] font-extrabold text-slate-800 mb-1">Select a conversation</h3>
            <p className="text-[14px] text-slate-400 max-w-xs">Choose from the list on the left to start chatting with your connections.</p>
          </div>
        )}
      </div>
    </div>
  );
}
