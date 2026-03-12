import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => (
  <div className="flex min-h-screen flex-col bg-zinc-50">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
