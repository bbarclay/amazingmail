import React from 'react';
import Head from 'next/head';
import styles from './Layout.module.css'; // Assuming we will create a CSS module for styling

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Your Site Title</title>
            </Head>
            <header className={styles.header}>
                <h1>Header</h1>
            </header>
            <aside className={styles.sidebar}>
                <h2>Sidebar</h2>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                <p>Footer</p>
            </footer>
        </div>
    );
};

export default Layout;
