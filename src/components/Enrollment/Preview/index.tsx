

interface Props {
    enrollmentId: string;
    nextStep: ()=> void;
}


export default function Preview(props: Props){
    console.log(props);
    return (<></>);
}