export default (input: string): string => {
    return input.replace(/(^[a-z]| [a-z]|-[a-z]|_[a-z])/g,
        function ($1) {
            return $1.toUpperCase();
        }
    )
}