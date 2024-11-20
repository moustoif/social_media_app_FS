import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import logo from "@/assets/insiansa-logo (2).png";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 sm:justify-between flex-nowrap">
        <Link href="/" className="text-7xl font-bold text-primary">
        <div className="flex items-center p-0"> {/* Conteneur inchangé */}
            <Image 
              src={logo} 
              alt="Logo inSiansa" 
              className="object-contain" // Garde les proportions de l'image
              width={180} // Largeur de l'image agrandie
              height={180} // Hauteur de l'image agrandie
              priority={true}
            />
          </div>
        </Link>
        <SearchField />
        <UserButton className="ms-auto mr-5"/>
      </div>
    </header>
  );
}
