import React from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const posts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=600&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=600&auto=format&fit=crop",
              href="https://www.instagram.com/m_timepiece1/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square group overflow-hidden cursor-pointer"
            >
              <img 
                src={post.image} 
                alt="Instagram Post" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white" size={32} />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a 
            href="https://www.instagram.com/m_timepiece1/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all"
          >
            <Instagram size={20} />
            Follow Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
