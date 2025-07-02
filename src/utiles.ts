
export const randomHash = (n: number): string =>  {
    const random = '1234567890qwertyuiopasdfghjklzxcvbnm';

    let hash: string = ""; 
    let len: number = random.length;

    for(let i=0; i<n; i++){
        hash += random[Math.floor((Math.random()) * len)];
    }

    return hash;
}