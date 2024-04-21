import React from "react";
import {Slideshow} from "./Slideshow";

interface Theme {
    background: string;
    iconColor: string;
    thumbnailBorder: string;
    textColor: string;
}

interface Themes {
    day: Theme;
    night: Theme;
    lightbox: Theme;
}

const themes: Themes = {
    day: {
        background: 'white',
        iconColor: 'black',
        thumbnailBorder: 'solid transparent 2px',
        textColor: 'black'
    },
    night: {
        background: '#151515',
        iconColor: 'silver',
        thumbnailBorder: 'solid rgb(107, 133, 206)  2px',
        textColor: 'silver'
    },
    lightbox: {
        background: 'rgba(12, 12, 12, 0.93)',
        iconColor: 'silver',
        thumbnailBorder: 'solid rgb(107, 133, 206) 2px',
        textColor: 'silver'
    }
};
const defaultTheme = "lightbox";

interface Props {
    backgroundColor?: string;
    iconColor?: string;
    theme?: keyof Themes;
    image: {
        src: string;
        title: string;
    };
}

export const AnimImage: React.FC<Props> = (props) => {
    const [backgroundColor, setBackgroundColor] = React.useState(
        props.backgroundColor ? props.backgroundColor : themes[defaultTheme].background
    );
    const [iconColor, setIconColor] = React.useState(
        props.iconColor ? props.iconColor : themes[defaultTheme].iconColor
    );

    const [state, setState] = React.useState();

    React.useEffect(() => {
        if (props.theme) {
            if (themes[props.theme]) {
                setBackgroundColor(themes[props.theme].background);
                setIconColor(themes[props.theme].iconColor);
            }
        }
        return () => {};
    }, [state]);

    return (
        <Slideshow
            backgroundColor={backgroundColor}
            iconColor={iconColor}
            showThumbnails={false}
            theme={props.theme}
            showArrows={false}
            showThumbnailIcon={false}
            showSlideshowIcon={false}
        >
            <img src={props.image.src} alt={props.image.title} />
        </Slideshow>
    );
};