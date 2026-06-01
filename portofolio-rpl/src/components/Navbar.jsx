import {Link, useLocation} from "react-router-dom";

export default function Navbar() {
    const {pathname} = useLocation();
    const nav = (to, label) => (
    <Link to={to} className={pathname === to ? "nav active" : "nav"}>
        {label}
        </Link>
        );
        
    return (
    <header className="navbar">
        <h1 className="logo">Portofolio XI RPL</h1>
        <nav className="menu">
        {nav("/", "Home")}
        {nav("/about", "About")}
        {nav("/projects", "Projects")}
        {nav("/contact", "Contact")}
        {nav("/AdminLogin", "Login")}
        </nav>
    </header>
);
}