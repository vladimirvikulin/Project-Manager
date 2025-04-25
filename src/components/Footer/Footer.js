import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p>Project Manager App &copy; 2025</p>
                <p>Версія: 1.0.0</p>
                <p>Зв’язок: v5o4v7a9@gmail.com</p>
            </div>
        </footer>
    );
};

export default Footer;