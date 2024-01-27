// Desc: Error block component
import { motion } from 'framer-motion'

type ErrorBlockProps = {
    error: string | null,
    className?: string
}

const ErrorBlock = ({ error, className }: ErrorBlockProps) => {
    return (
        <>
            {error && (<motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={className} role="alert">
                <span className="block sm:inline">{error}</span>
            </motion.div>)}
        </>
    )
}

export default ErrorBlock