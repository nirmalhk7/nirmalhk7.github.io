import React, { useState, useMemo, useEffect } from "react";
import loadYaml from "@/util/loadYaml";
import path from "path";
import { GetStaticProps } from "next";
import { DefaultPageProps } from "./_app";
import { QuoteInterface } from "@/components/Quote/quoteSection";
import sampleSize from "lodash/sampleSize";
import { trackView, trackError, trackClick } from "@/util/analytics";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { loadMarkdownFiles } from "@/util/loadMarkdown";
import { ProjectFrontmatterInterface } from "@/interfaces/projects";
import { BlogFrontmatterInterface } from "@/interfaces/blog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowRight, faHome, faBook, faCode, faEnvelope } from "@fortawesome/free-solid-svg-icons";

interface SearchItem {
  title: string;
  url: string;
  type: "page" | "project" | "blog";
  icon: any;
}

interface NotFoundPageProps extends DefaultPageProps {
  searchIndex: SearchItem[];
}

const NotFoundPage = ({ searchIndex }: NotFoundPageProps) => {
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    trackView("404_page");
    trackError("404 Not Found", false);
  }, []);

  const filteredItems = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    
    // Map icons back to FontAwesome objects for display
    const iconMap: Record<string, any> = {
      faHome,
      faCode,
      faBook,
      faEnvelope
    };

    return searchIndex.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.type.toLowerCase().includes(lowerQuery)
    ).map(item => ({
      ...item,
      icon: typeof item.icon === 'string' ? iconMap[item.icon] || faSearch : item.icon
    })).slice(0, 5);
  }, [query, searchIndex]);

  return (
    <main className="min-h-screen bg-[#0d0a0b] text-white flex flex-col justify-center items-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.h1 
          className="text-[12rem] font-bold text-accent leading-none mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          404
        </motion.h1>
        <h2 className="text-4xl font-bold mb-8 uppercase tracking-widest">Lost in the sauce?</h2>
        <p className="text-gray-400 text-2xl mb-12">
          The page you&apos;re looking for has either moved to another dimension or never existed. 
          Let&apos;s get you back on track.
        </p>

        {/* Search Bar */}
        <div className="relative mb-12 group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent transition-colors">
            <FontAwesomeIcon icon={faSearch} size="lg" />
          </div>
          <input
            type="text"
            placeholder="Search for projects, blog posts, or pages..."
            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-6 pl-16 pr-6 text-xl focus:border-accent focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <AnimatePresence>
            {query && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-[#1a1718] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <Link 
                      key={item.url} 
                      href={item.url}
                      onClick={() => trackClick(item.title, "404_search_result")}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-accent/20 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent">
                        <FontAwesomeIcon icon={item.icon} />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">{item.title}</div>
                        <div className="text-gray-500 text-sm uppercase tracking-wider">{item.type}</div>
                      </div>
                      <FontAwesomeIcon icon={faArrowRight} className="ml-auto text-gray-700" />
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-8 text-gray-500 italic">
                    No results found for &quot;{query}&quot;. Maybe try &quot;projects&quot; or &quot;blog&quot;?
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
          {[
            { title: "Home", url: "/", icon: faHome },
            { title: "Projects", url: "/projects", icon: faCode },
            { title: "Blog", url: "/blog", icon: faBook },
            { title: "Contact", url: "/#contact", icon: faEnvelope },
          ].map((link) => (
            <Link 
              key={link.url} 
              href={link.url}
              onClick={() => trackClick(link.title, "404_quick_link")}
              className="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl transition-all hover:-translate-y-1 group"
            >
              <FontAwesomeIcon icon={link.icon} className="text-2xl mb-3 text-accent group-hover:scale-110 transition-transform" />
              <div className="font-bold uppercase tracking-wider text-sm">{link.title}</div>
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
};

export const getStaticProps: GetStaticProps<NotFoundPageProps> = async () => {
  const quotesPath = path.join(process.cwd(), 'content/yml/quotes.yaml');
  const allQuotesYaml = loadYaml<QuoteInterface[]>(quotesPath);

  // Build Search Index
  const projects = loadMarkdownFiles<ProjectFrontmatterInterface>("content/projects", {
    getContent: false,
    getExcerpt: false,
  });

  const blogs = loadMarkdownFiles<BlogFrontmatterInterface>("content/blog", {
    getContent: false,
    getExcerpt: false,
  });

  const searchIndex: any[] = [
    { title: "Home", url: "/", type: "page", icon: "faHome" },
    { title: "Projects", url: "/projects", type: "page", icon: "faCode" },
    { title: "Blog", url: "/blog", type: "page", icon: "faBook" },
    { title: "Resume", url: "/resume", type: "page", icon: "faBook" },
    ...projects.map(p => ({
      title: p.frontmatter.title,
      url: `/projects#${p.frontmatter.title}`,
      type: "project",
      icon: "faCode"
    })),
    ...blogs.map(b => ({
      title: b.frontmatter.title,
      url: `/blog/${b.slug}`,
      type: "blog",
      icon: "faBook"
    }))
  ];

  return {
    props: {
      searchIndex,
      quote: sampleSize(allQuotesYaml)[0],
      pageMetadata: {
        enableWrap: true,
        seoMetadata: {
          title: "Page not Found",
          description: "It's a 404! But let's find you something else interesting.",
        },
      },
    },
  };
};

export default NotFoundPage;
