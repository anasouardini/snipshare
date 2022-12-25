type sometype = {name: string};

function isType(s: unknown): s is sometype {
    // it's the right "shape"
    return true;
}

export function test(a: string, b: string): void;
export function test(a: number | sometype, b?: unknown): void;
export function test(a: number | string | sometype, b: string) {
    if (typeof a == 'number') {
        console.log(a + 1);
        console.log(b.concat() + 1);
    } else if (typeof a == 'string') {
        console.log(a.concat(b).toLowerCase);
    } else{
        a.name;
    }
}
test
