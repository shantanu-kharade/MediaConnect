import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;