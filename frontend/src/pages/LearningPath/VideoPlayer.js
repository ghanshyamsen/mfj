// Base styles for media player and provider (~400B).

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, Poster, PlayButton } from "@vidstack/react"

import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import { PauseIcon, PlayIcon } from '@vidstack/react/icons';

export default function VideoPlayer({link, title}){

    return (
        <div>
            <MediaPlayer
                src={link}
                viewType='video'
                streamType='on-demand'
                logLevel='warn'
                crossOrigin
                playsInline
                title={title}
            >
                <MediaProvider>
                    <Poster className="vds-poster" />
                </MediaProvider>
                <DefaultVideoLayout  icons={defaultLayoutIcons} />

            </MediaPlayer>
        </div>
    )

}