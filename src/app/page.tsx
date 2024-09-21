'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import HyperText from '@/components/magicui/hyper-text';

const LandingPage = () => {
  const [headerVisible, setHeaderVisible] = useState({
    intro: false,
    upgrade: false,
    features: false,
  });
  const [contentVisible, setContentVisible] = useState({
    upgrade: false,
    features: false,
  });

  return (
    <div className="container mx-auto px-4">
      <motion.header 
        className="text-center py-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onAnimationComplete={() => setHeaderVisible(prev => ({ ...prev, intro: true }))}
      >
        <motion.h1 
          className="text-4xl font-bold mb-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <a href="#intro" className="block h-[1.5em]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex justify-center"
            >
              {headerVisible.intro ? <HyperText text="Introducing dan3" className="inline-block" animateOnLoad={false} /> : <span className="invisible">Introducing dan3</span>}
            </motion.div>
          </a>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: headerVisible.intro ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          The evolution of dan 2.0 - Now even better!
        </motion.p>
      </motion.header>

      <main>
        <motion.section 
          className="text-center py-16 bg-gray-100 rounded-lg bg-dot-pattern"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 3.0 }}
          onAnimationComplete={() => {
            setHeaderVisible(prev => ({ ...prev, upgrade: true }));
          }}
        >
          <motion.h2 
            className="text-3xl font-semibold mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3.5 }}
            onAnimationComplete={() => setContentVisible(prev => ({ ...prev, upgrade: true }))}
          >
            <a href="#upgrade" className="block h-[1.2em]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.5 }}
                className="flex justify-center"
              >
                {headerVisible.upgrade ? <HyperText text="Upgrade to dan3" className="inline-block" animateOnLoad={false} /> : <span className="invisible">Upgrade to dan3</span>}
              </motion.div>
            </a>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: contentVisible.upgrade ? 1 : 0, y: contentVisible.upgrade ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.0 }}
          >
            <p className="text-lg mb-6">Experience the next level of responsive, flexible, and dynamic technology</p>
            <motion.button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.section>

        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          onAnimationComplete={() => {
            setHeaderVisible(prev => ({ ...prev, features: true }));
          }}
        >
          <motion.h2 
            className="text-3xl font-semibold mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 5 }}
            onAnimationComplete={() => setContentVisible(prev => ({ ...prev, features: true }))}
          >
            <a href="#features" className="block h-[1.2em]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 4.5 }}
                className="flex justify-center"
              >
                {headerVisible.features ? <HyperText text="Key Features" className="inline-block" animateOnLoad={false} /> : <span className="invisible">Key Features</span>}
              </motion.div>
            </a>
          </motion.h2>
          <motion.ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate={contentVisible.features ? "visible" : "hidden"}
            variants={{
              visible: {
                transition: {
                  delayChildren: 0.5,
                  staggerChildren: 0.8,
                },
              },
            }}
          >
            {[
              {
                title: "Secure",
                icon: "🔒",
              },
              {
                title: "Reliable",
                icon: "✅",
              },
              {
                title: "Doesn't follow the rule of 3s",
                icon: "🚀",
              },
              {
                title: "Decentralized (??)",
                icon: "🌐",
              },
            ].map((feature, index) => (
              <motion.li
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <FeatureCard
                  title={feature.title}
                  description={""}
                  icon={feature.icon}
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

      </main>

    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-md"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <span className="text-4xl mb-4 block text-center">{icon}</span>
      <h3 className="text-xl font-semibold mb-2 text-center">
        <a href={`#${title.toLowerCase()}`} className="block h-[1.2em]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center"
          >
            {title}
          </motion.div>
        </a>
      </h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

export default LandingPage;
