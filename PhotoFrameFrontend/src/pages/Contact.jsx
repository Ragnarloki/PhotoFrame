import { motion } from 'framer-motion';
import { AiOutlineMail, AiOutlinePhone, AiOutlineWhatsApp, AiOutlineInstagram, AiOutlineEnvironment } from "react-icons/ai";
import { BsClock } from "react-icons/bs";

export default function Contact() {
    const config = {
        email: 'sivasankarswaminathan62@gmail.com',
        mobile: '9361487662',
        whatsapp: 'https://wa.me/9361487662',
        instagram: 'https://www.instagram.com/siva_white_oc', // Add your Instagram handle
        location: '22, Pillaiyar Koil Steet, Goripalayam, Madurai, Tamil Nadu 625002',
        workingHours: 'Mon - Fri: 9 AM - 9 PM'
    };

    return (
        <section 
            id="contact" 
            className="flex flex-col items-center bg-gradient-to-br from-purple-600 to-indigo-700 px-8 py-20 text-white"
        >
            {/* Contact Info Section */}
            <ContactInfo config={config} />

        </section>
    );
}

// Contact Info Component
const ContactInfo = ({ config }) => (
    <motion.div
        className="flex flex-col items-center w-full max-w-2xl "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
    >
        <h1 className="text-5xl border-b-4 border-white pb-3 mb-5 font-extrabold text-center">Get in Touch</h1>
        <p className="pb-5 text-lg text-center">
            I'm always open to discussions, collaborations, and new opportunities. Reach out to me!
        </p>

        {/* Contact Details */}
        <div className="flex flex-col gap-4 text-lg w-full">
            <ContactItem 
                icon={<AiOutlineMail size={28} className="text-purple-600" />}
                text={config.email}
                link={`https://mail.google.com/mail/?view=cm&fs=1&to=${config.email}`}
                color="hover:text-purple-600"
            />
            <ContactItem 
                icon={<AiOutlinePhone size={28} className="text-green-600" />}
                text={`Mobile: ${config.mobile}`}
                color="hover:text-green-600"
            />
            <ContactItem 
                icon={<AiOutlineWhatsApp size={28} className="text-green-500" />}
                text="WhatsApp"
                link={config.whatsapp}
                color="hover:text-green-600"
            />
            <a href="https://maps.app.goo.gl/e5SXQfEStvYnLgoq7"><ContactItem 
                icon={<AiOutlineEnvironment size={28} className="text-blue-600" />}
                text={config.location}
                color="hover:text-blue-600"
            /></a>
              <ContactItem 
                icon={<AiOutlineInstagram size={28} className="text-pink-600" />}
                text="Instagram"
                link={config.instagram}
                color="hover:text-pink-600"
            />
            <ContactItem 
                icon={<BsClock size={28} className="text-orange-600" />}
                text={config.workingHours}
                color="hover:text-orange-600"
            />
        </div>

        {/* Call-to-Action Button */}
        <motion.a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${config.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-purple-600 hover:text-white transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Let's Collaborate
        </motion.a>
    </motion.div>
);
// Reusable Contact Item Component
const ContactItem = ({ icon, text, link, color }) => (
    <motion.div 
        className="flex items-center gap-3 bg-white text-black p-3 rounded-lg shadow-lg cursor-pointer"
        whileHover={{ scale: 1.05 }}
    >
        {icon}
        {link ? (
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`font-bold ${color}`}
            >
                {text}
            </a>
        ) : (
            <span className="font-bold">{text}</span>
        )}
    </motion.div>
);

