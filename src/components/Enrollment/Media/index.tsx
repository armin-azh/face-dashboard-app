
// Components
import Images from "./Images.tsx";
import Video from "./Video.tsx";
import Recording from "./Recording.tsx";

// Types
import type {Enrollment} from "../../../types/models.tsx";

interface Props {
    enrollment: Enrollment;
    nextStep: ()=> void;
}

export default function Media(props: Props) {

    if(props.enrollment.type === "video") {
        return <Video enrollmentId={props.enrollment.prime}/>
    }else if(props.enrollment.type === "images") {
        return <Images enrollmentId={props.enrollment.prime}/>
    }else if(props.enrollment.type === "recording") {
        return <Recording enrollmentId={props.enrollment.prime} nextStep={props.nextStep}/>
    }else {
        return null;
    }
}