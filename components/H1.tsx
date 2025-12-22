import clsx from "clsx";

type H1Props = {
    children: React.ReactNode,
    className?: string,
}

export default function H1({ children, className = "" }: H1Props) {
    return (
        <>
            <h1 className={clsx("text-[3.5rem] tracking-[5px] uppercase text-white/90 mt-0 mb-0 text-center", className)}>
                <span className="font-light">{children}</span>
            </h1 >
        </>

    );
}