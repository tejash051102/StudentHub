import { motion } from 'framer-motion';

export default function StatCard({ label, value, detail, tone = 'blue' }) {
  return (
    <motion.article
      className={`stat-card tone-${tone}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.28 }}
    >
      <div className="stat-icon">{label.slice(0, 2).toUpperCase()}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </motion.article>
  );
}
