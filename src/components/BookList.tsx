import { IBook } from "../../types";

export interface BookListProps{
    title?:string;
    books:IBook[];
    containerClassName?:string;
}
export default function BookList( { title, books, containerClassName} : BookListProps) {
    return (
        <section>
            <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
        </section>
    );
}
