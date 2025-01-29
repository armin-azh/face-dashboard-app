
interface Props {
    enrollmentId: string;
    nextStep: ()=> void;
}

export default function Extraction(props: Props) {
    console.log(props);
    return (<></>);
}