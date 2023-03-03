import FORM_FACTOR from '@salesforce/client/formFactor'



const isMobile = () => {
    return (FORM_FACTOR == 'Small' || FORM_FACTOR == 'Medium');
};


export {
    isMobile
}