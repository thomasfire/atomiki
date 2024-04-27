export function Copyright() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white text-gray-500 text-center p-4 -mt-14">
            <div className="container mx-auto">
                <p className="text-sm">
                    &copy; {currentYear} 火焚 富良 Tomiyoshi Hitaki. All rights reserved.
                    <a href="https://github.com/thomasfire/atomiki"> Source code. </a>
                </p>
            </div>
        </footer>
    );
}