import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useUI } from "../../context/AppContext";
import {
  Camera,
  Heart,
  MessageCircle,
  Globe,
  Briefcase,
  MapPin,
} from "../icons";

// Mock profile posts data
const profilePosts = [
  {
    id: "p1",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    likes: 234,
    comments: 18,
    caption: "Mountain vibes ⛰️",
  },
  {
    id: "p2",
    image:
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop",
    likes: 456,
    comments: 32,
    caption: "Golden hour magic ✨",
  },
  {
    id: "p3",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop",
    likes: 189,
    comments: 24,
    caption: "Exploring new horizons 🌅",
  },
  {
    id: "p4",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop",
    likes: 312,
    comments: 28,
    caption: "Nature's beauty 🌲",
  },
  {
    id: "p5",
    image:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=600&fit=crop",
    likes: 278,
    comments: 15,
    caption: "Waterfall adventures 💧",
  },
  {
    id: "p6",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop",
    likes: 198,
    comments: 21,
    caption: "Misty mornings 🌫️",
  },
];

const ProfileTab = () => {
  const { currentUser, currentUserAvatar } = useUser();
  const [activeTab, setActiveTab] = useState("posts");
  const [hoveredPost, setHoveredPost] = useState(null);

  const stats = {
    posts: 142,
    followers: "24.7K",
    following: 318,
  };

  const tabs = [
    { id: "posts", label: "Posts", count: 142 },
    { id: "photos", label: "Photos", count: 89 },
    { id: "about", label: "About", count: null },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full pb-8">
      {/* Cover Photo */}
      <div className="relative h-32 sm:h-48 md:h-56 bg-linear-to-r from-orange-400 via-amber-500 to-orange-500 rounded-b-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <motion.button
          className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit Cover</span>
        </motion.button>
      </div>

      {/* Profile Header */}
      <div className="relative px-4 sm:px-6">
        {/* Avatar */}
        <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
          <div className="relative">
            <img
              src={currentUserAvatar}
              alt={currentUser.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-lg"
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            <motion.button
              className="absolute bottom-0 right-0 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full shadow-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600 dark:text-slate-300" />
            </motion.button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-14 sm:pt-20">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentUser.username}
              </p>

              {/* Bio */}
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 max-w-md">
                {currentUser.profession} passionate about design, technology,
                and creating meaningful experiences. Let's connect and build
                something amazing together! 🚀
              </p>

              {/* Info Tags */}
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  {currentUser.profession}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentUser.location}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                  orbit.social/jordanm
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:mt-0">
              <motion.button
                className="flex-1 sm:flex-none bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Profile
              </motion.button>
              <motion.button
                className="flex-1 sm:flex-none bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Share Profile
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-5 py-4 border-t border-b border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {stats.posts}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Posts
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {stats.followers}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {stats.following}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Following
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {tab.label}
                {tab.count && (
                  <span
                    className={`ml-1.5 text-xs ${
                      activeTab === tab.id
                        ? "text-orange-100"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Posts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
                {profilePosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden cursor-pointer group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onHoverStart={() => setHoveredPost(post.id)}
                    onHoverEnd={() => setHoveredPost(null)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay */}
                    <AnimatePresence>
                      {hoveredPost === post.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4"
                        >
                          <div className="flex items-center gap-1.5 text-white">
                            <Heart className="w-5 h-5 fill-white" />
                            <span className="text-sm font-semibold">
                              {post.likes}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-semibold">
                              {post.comments}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "photos" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Photos Grid - Same as posts but with different layout */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-1.5">
                {profilePosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                About Me
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Hey there! I'm {currentUser.name}, a {currentUser.profession}{" "}
                based in {currentUser.location}. I'm passionate about creating
                meaningful digital experiences and connecting with like-minded
                individuals. When I'm not designing, you'll find me exploring
                nature, capturing moments through photography, or diving into a
                good book.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Work
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {currentUser.profession} at Creative Studio
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Location
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {currentUser.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Website
                    </p>
                    <p className="text-sm font-medium text-orange-500 hover:text-orange-600 cursor-pointer">
                      orbit.social/jordanm
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Design",
                    "Photography",
                    "Travel",
                    "Technology",
                    "Music",
                    "Art",
                  ].map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileTab;
