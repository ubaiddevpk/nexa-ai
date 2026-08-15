import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Mail, 
  Image as ImageIcon, 
  FileText, 
  Lightbulb, 
  Menu, 
  Mic, 
  Send, 
  Paperclip,
  Share2,
  Download,
  Volume2,
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Check,
  Eye,
  Terminal,
  X,
  CheckCheck,
  Loader2
} from 'lucide-react';
import NexaLogo from '../components/NexaLogo';

export default function Dashboard({ 
  onMenuToggle, 
  onVoiceToggle,
  chatSession,
  onSendMessage,
  onSuggestionClick,
  onAttachPDF,
  isSending = false,
  isUploadingPDF = false,
  onRemovePDF
}) {
  const [inputText, setInputText] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [reactions, setReactions] = useState({}); // { [messageId]: 'like' | 'dislike' | null }
  const [shareTooltip, setShareTooltip] = useState(false);
  const fileInputRef = useRef(null);

  const suggestions = [
    { id: 'email', label: 'Write an email', icon: Mail, color: 'text-purple-400 bg-purple-500/10' },
    { id: 'pdf', label: 'Summarize a PDF', icon: FileText, color: 'text-blue-400 bg-blue-500/10' },
    { id: 'concept', label: 'Explain a concept', icon: Lightbulb, color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'code', label: 'Write some code', icon: ImageIcon, color: 'text-yellow-400 bg-yellow-500/10' },
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleListenText = (text, id) => {
    if ('speechSynthesis' in window) {
      if (speakingMessageId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setSpeakingMessageId(null);
        };
        utterance.onerror = () => {
          setSpeakingMessageId(null);
        };
        setSpeakingMessageId(id);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert('Text-to-speech not supported in this browser.');
    }
  };

  const handleReaction = (id, type) => {
    setReactions(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const handleRegenerate = (text) => {
    onSendMessage(text);
  };

  // Share: copy a shareable summary of the chat to clipboard
  const handleShare = () => {
    if (!chatSession) return;
    const text = chatSession.messages
      .map(m => `${m.role === 'user' ? 'You' : 'NexaAI'}: ${m.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setShareTooltip(true);
    setTimeout(() => setShareTooltip(false), 2000);
  };

  // Download: save the full chat as a .txt file
  const handleDownload = () => {
    if (!chatSession) return;
    const text = `NexaAI Chat - ${chatSession.title}\n${'='.repeat(40)}\n\n` +
      chatSession.messages
        .map(m => `[${m.role === 'user' ? 'You' : 'NexaAI'}]\n${m.content}`)
        .join('\n\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatSession.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePDFUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload PDF files only.');
        return;
      }
      onAttachPDF(file);
      e.target.value = null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen relative overflow-hidden">
      
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-3.5 border-b border-[#2d2938] bg-[#0d0b11]/80 backdrop-blur-md sticky top-0 z-30">
        
        {/* Left: Menu + Brand Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={onMenuToggle}
            className="p-2 text-[#9c93a8] hover:text-white rounded-lg md:hidden hover:bg-[#17141e] shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2.5 min-w-0">
            <NexaLogo className="w-6 h-6 shrink-0" animated={false} />
            {chatSession ? (
              <span className="font-semibold text-white truncate max-w-[150px] sm:max-w-xs md:max-w-md text-sm sm:text-base">
                {chatSession.title}
              </span>
            ) : (
              <span className="font-bold text-base sm:text-lg text-white tracking-wide">Nexa AI</span>
            )}
          </div>
        </div>

        {/* Right: Share + Download */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative">
            <button
              onClick={handleShare}
              disabled={!chatSession || chatSession.messages.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#9c93a8] hover:text-white rounded-lg hover:bg-[#17141e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Copy chat to clipboard"
            >
              {shareTooltip ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{shareTooltip ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
          <button
            onClick={handleDownload}
            disabled={!chatSession || chatSession.messages.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#9c93a8] hover:text-white rounded-lg hover:bg-[#17141e] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Download chat as .txt file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </header>

      {/* Main Area Scrollable body */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 pb-32">
        {!chatSession || chatSession.messages.length === 0 ? (
          /* Landing Welcome State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center space-y-8">
            <div className="relative group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-24 h-24 rounded-3xl bg-[#17141e] border border-[#2d2938] flex items-center justify-center shadow-2xl p-4">
                <NexaLogo className="w-16 h-16" animated={true} />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">Nexa AI</span>.
              </h2>
              <p className="text-sm md:text-base text-[#9c93a8]">
                How can I help you today?
              </p>
            </div>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {suggestions.map((sug) => {
                const IconComponent = sug.icon;
                return (
                  <button
                    key={sug.id}
                    onClick={() => onSuggestionClick(sug.label)}
                    className="flex flex-col items-start p-4 rounded-2xl bg-[#17141e] border border-[#2d2938] hover:border-purple-500/50 hover:bg-[#201c2a] transition-all duration-200 text-left group"
                  >
                    <div className={`p-2.5 rounded-xl ${sug.color} mb-3 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-white">{sug.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Dialogue State */
          <div className="max-w-3xl mx-auto space-y-6">
            {chatSession.messages.map((message) => (
              <div key={message.id || message._id} className="space-y-2">
                
                {/* User Message */}
                {message.role === 'user' ? (
                  <div className="flex flex-col items-end gap-1.5 pl-12">
                    <div className="px-5 py-3 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white shadow-lg text-sm max-w-full">
                      {message.content}
                    </div>
                    {/* Display if a PDF file context is associated with this prompt */}
                    {message.attachedPDF && (
                      <div className="flex items-center gap-1.5 text-xs text-[#9c93a8] bg-[#17141e] border border-[#2d2938] px-2.5 py-1 rounded-lg">
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        <span>Reference: {message.attachedPDF}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Assistant Message Card */
                  <div className="flex gap-3.5 pr-6">
                    <div className="w-8 h-8 rounded-xl bg-[#17141e] border border-purple-500/30 flex items-center justify-center shrink-0 p-1 shadow-md shadow-purple-950/30">
                      <NexaLogo className="w-5 h-5" animated={false} />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] text-sm text-[#e5e4e7] leading-relaxed space-y-4 shadow-xl">
                        
                        {message.title && (
                          <h4 className="font-bold text-white text-base">{message.title}</h4>
                        )}

                        <div className="markdown-content">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold text-white mt-3 mb-1.5" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mt-2.5 mb-1" {...props} />,
                              h4: ({node, ...props}) => <h4 className="text-sm font-bold text-white mt-2 mb-1" {...props} />,
                              p: ({node, ...props}) => <p className="mb-3 text-[#e5e4e7] leading-relaxed" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-purple-300" {...props} />,
                              em: ({node, ...props}) => <em className="italic text-[#c8c5cc]" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-outside mb-4 space-y-2 pl-5" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-outside mb-4 space-y-2 pl-5" {...props} />,
                              li: ({node, ...props}) => <li className="text-[#e5e4e7] text-sm pl-1" {...props} />,
                              pre: ({node, ...props}) => <pre className="bg-black/30 p-3 rounded-lg border border-[#2d2938] overflow-x-auto my-3" {...props} />,
                              code: ({node, children, ...props}) => (
                                <code className="bg-[#201c2a] text-purple-300 px-1.5 py-0.5 rounded font-mono text-xs border border-[#2d2938]" {...props}>
                                  {children}
                                </code>
                              ),
                              img: ({node, src, alt, ...props}) => (
                                <img
                                  src={src}
                                  alt={alt || 'Generated Image'}
                                  className="rounded-xl max-w-full mt-3 border border-[#2d2938] shadow-xl"
                                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                                  {...props}
                                />
                              ),
                              hr: ({node, ...props}) => <hr className="border-[#2d2938] my-4" {...props} />,
                              blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-purple-500 pl-3 text-[#9c93a8] italic my-3" {...props} />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {message.codeBlock && (
                          <div className="rounded-xl overflow-hidden border border-[#2d2938] bg-black/40">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#201c2a] text-xs text-[#9c93a8] border-b border-[#2d2938]">
                              <span>JavaScript</span>
                              <button 
                                onClick={() => handleCopyText(message.codeBlock, (message.id || message._id) + '-code')} 
                                className="flex items-center gap-1 hover:text-white"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </button>
                            </div>
                            <pre className="p-4 text-xs font-mono overflow-x-auto text-purple-300">
                              <code>{message.codeBlock}</code>
                            </pre>
                          </div>
                        )}

                        {message.specialCard && (
                          <div className="p-4 rounded-xl bg-[#201c2a] border border-[#2d2938] flex gap-3 text-xs text-[#9c93a8] leading-relaxed">
                            <div className="shrink-0 p-1.5 rounded-lg bg-purple-500/10 text-purple-400 h-fit">
                              <Terminal className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-white mb-1">{message.specialCard.title}</h5>
                              <p>{message.specialCard.description}</p>
                            </div>
                          </div>
                        )}

                        {message.actionPills && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {message.actionPills.map((pill, idx) => (
                              <button 
                                key={idx}
                                onClick={() => onSuggestionClick(pill)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2d2938] bg-[#201c2a] text-xs text-[#9c93a8] hover:border-purple-500 hover:text-white transition-all"
                              >
                                <Eye className="w-3.5 h-3.5 text-purple-400" />
                                <span>{pill}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Message controls */}
                      <div className="flex items-center gap-3 pl-2 text-[#9c93a8]">
                        <button 
                          onClick={() => handleListenText(message.content, message.id || message._id)}
                          className={`transition-colors ${speakingMessageId === (message.id || message._id) ? 'text-purple-400 hover:text-purple-300' : 'hover:text-white'}`}
                          title={speakingMessageId === (message.id || message._id) ? "Stop listening" : "Listen to response"}
                        >
                          <Volume2 className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleCopyText(message.content, message.id || message._id)}
                          className="hover:text-white transition-colors relative"
                          title="Copy response"
                        >
                          {copiedMessageId === (message.id || message._id) ? (
                            <Check className="w-4.5 h-4.5 text-green-400" />
                          ) : (
                            <Copy className="w-4.5 h-4.5" />
                          )}
                        </button>
                        <button 
                          onClick={() => handleRegenerate(message.content)}
                          className="hover:text-white transition-colors" 
                          title="Regenerate"
                        >
                          <RotateCcw className="w-4.5 h-4.5" />
                        </button>
                        <span className="text-[#2d2938]">|</span>
                        <button 
                          onClick={() => handleReaction(message.id || message._id, 'like')}
                          className={`transition-colors ${reactions[message.id || message._id] === 'like' ? 'text-green-400 hover:text-green-300' : 'hover:text-white'}`} 
                          title="Good response"
                        >
                          <ThumbsUp className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleReaction(message.id || message._id, 'dislike')}
                          className={`transition-colors ${reactions[message.id || message._id] === 'dislike' ? 'text-red-400 hover:text-red-300' : 'hover:text-white'}`} 
                          title="Poor response"
                        >
                          <ThumbsDown className="w-4.5 h-4.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Input Bar */}
      <footer className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-[#0d0b11] via-[#0d0b11]/90 to-transparent z-20">
        <div className="max-w-3xl mx-auto space-y-2">
          
          {/* File input handler for PDF uploads */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf" 
            className="hidden" 
          />

          {/* Active PDF file indicator above input bar */}
          {chatSession?.activePDF && !isUploadingPDF && (
            <div className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 animate-fade-in mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Attached Context: <strong>{chatSession.activePDF}</strong></span>
              <button 
                onClick={onRemovePDF}
                className="ml-1 p-0.5 rounded-full hover:bg-purple-500/20 text-purple-400 hover:text-white transition-colors"
                title="Remove attached PDF context"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* PDF Uploading Progress Bar Component */}
          {isUploadingPDF && (
            <div className="p-3 rounded-2xl bg-[#17141e] border border-purple-500/30 shadow-xl mb-1.5 animate-fadeIn space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-purple-300 font-medium">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span>Uploading & Parsing PDF document...</span>
                </div>
                <span className="text-[11px] text-[#9c93a8] font-mono">Processing text</span>
              </div>
              
              {/* Animated Glowing Progress Bar Track */}
              <div className="w-full bg-[#0d0b11] rounded-full h-1.5 overflow-hidden relative">
                <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 rounded-full animate-shimmer" />
              </div>
            </div>
          )}

          {/* AI thinking loading indicator with animated NexaLogo */}
          {isSending && (
            <div className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-300 animate-fadeIn">
              <div className="w-5 h-5 rounded-lg bg-[#17141e] border border-purple-500/30 flex items-center justify-center p-0.5 shadow-sm shadow-purple-950/30">
                <NexaLogo className="w-4 h-4" animated={false} isLoading={true} />
              </div>
              <span className="font-medium text-[#e5e4e7]">Nexa AI is thinking...</span>
              <div className="flex gap-1 ml-0.5">
                <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]"></span>
                <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]"></span>
                <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          )}

          {/* Input field box */}
          <div className="flex items-center gap-2 px-4 py-3.5 bg-[#17141e] border border-[#2d2938] rounded-2xl shadow-2xl focus-within:border-purple-500/50 transition-all">
            
            <button 
              onClick={handlePDFUploadClick}
              disabled={isUploadingPDF}
              className={`p-1.5 rounded-lg transition-colors ${
                isUploadingPDF 
                  ? 'text-purple-400 bg-purple-500/10 cursor-not-allowed' 
                  : 'text-[#9c93a8] hover:text-white hover:bg-[#201c2a]'
              }`}
              title={isUploadingPDF ? "Uploading PDF..." : "Attach PDF context"}
            >
              {isUploadingPDF ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              ) : (
                <Paperclip className="w-5 h-5" />
              )}
            </button>
            
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                isUploadingPDF 
                  ? "Extracting PDF text into session context..." 
                  : chatSession?.activePDF 
                  ? "Ask about the attached PDF..." 
                  : "Message Nexa AI..."
              }
              className="flex-1 bg-transparent border-0 outline-none ring-0 text-white text-sm placeholder-[#6b6375]"
            />
            
            <button 
              onClick={onVoiceToggle}
              className="p-1.5 text-[#9c93a8] hover:text-white hover:bg-[#201c2a] rounded-lg transition-colors"
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || isSending || isUploadingPDF}
              className={`p-2 rounded-xl text-white transition-all shadow-lg ${
                inputText.trim() && !isSending && !isUploadingPDF
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:scale-105 active:scale-95' 
                  : 'bg-transparent text-[#6b6375] cursor-not-allowed'
              }`}
            >
              {isSending 
                ? <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                : <Send className="w-4 h-4" />
              }
            </button>

          </div>

          <p className="text-center text-[10px] text-[#6b6375]">
            Nexa AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </footer>

    </div>
  );
}
