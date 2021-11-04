import { useMediaQuery } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import MobileMenu from "../MobileMenu/MobileMenu";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    const matches = useMediaQuery('(min-width:500px)');
    return (
        <BrowserRouter>
            <div className="Layout">
                <header>
                    <Header />
                </header>
                { !matches && <MobileMenu />}
                { matches && 
                    <aside>
                        <Menu />
                    </aside>
                }
                <main>
                    <Routing />
                </main>
                <footer>
                    <Footer />
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default Layout;