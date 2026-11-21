import React from 'react';
import { ArrowRight, Clock, User, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../../data/blogs';
import { useStore } from '../../context/StoreContext';

export const BlogListPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="bg-[#17191C] min-h-screen py-16 border-b border-[#25282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-2">
            Energy Research & Engineering Insights
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F2F0EA] tracking-tight">
            Battery Engineering Publications
          </h1>
          <p className="text-sm text-[#B7BCC2] mt-2">
            In-depth whitepapers on cell chemistry, thermal dynamics, and power infrastructure optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate('blog-detail', { slug: post.slug })}
              className="group bg-[#101214] border border-[#25282D] hover:border-[#343940] rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-colors"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#25282D]">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#D6B98C] uppercase">
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#F2F0EA] group-hover:text-[#D6B98C] transition-colors mt-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-[#8E959E] mt-2 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#25282D] flex items-center justify-between text-[#8E959E] text-[11px]">
                  <span>{post.author}</span>
                  <span className="text-[#D6B98C] flex items-center gap-1 font-semibold">
                    Read Whitepaper <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogDetailPage: React.FC = () => {
  const { pageParams, navigate } = useStore();
  const slug = pageParams?.slug || BLOG_POSTS[0].slug;
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  return (
    <div className="bg-[#17191C] min-h-screen py-16 border-b border-[#25282D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8E959E] font-mono mb-6">
          <button onClick={() => navigate('home')} className="hover:text-[#F2F0EA]">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('blog')} className="hover:text-[#F2F0EA]">
            Articles
          </button>
          <span>/</span>
          <span className="text-[#D6B98C] truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D6B98C] uppercase">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8E959E]">{post.date}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#F2F0EA] leading-tight">
            {post.title}
          </h1>

          <div className="text-xs text-[#8E959E] font-mono pt-1">
            Author: <strong className="text-[#F2F0EA]">{post.author}</strong>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#25282D] mb-10 border border-[#25282D]">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-10 text-xs sm:text-sm text-[#B7BCC2] leading-relaxed space-y-6">
          <div className="prose prose-invert max-w-none space-y-4">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-[#F2F0EA] pt-4">
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              }
              if (paragraph.startsWith('####')) {
                return (
                  <h4 key={idx} className="text-base font-bold text-[#D6B98C] pt-2">
                    {paragraph.replace('####', '').trim()}
                  </h4>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph.trim()}
                </p>
              );
            })}
          </div>

          <div className="pt-8 border-t border-[#25282D] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => navigate('blog')}
              className="min-h-[42px] px-4 py-2 bg-[#25282D] text-xs font-semibold text-[#F2F0EA] rounded-lg text-center"
            >
              ← Back to All Articles
            </button>
            <button
              onClick={() => navigate('shop')}
              className="min-h-[42px] px-4 py-2 bg-[#D6B98C] text-xs font-semibold text-[#17191C] rounded-lg text-center"
            >
              Shop Batteries Featured Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
