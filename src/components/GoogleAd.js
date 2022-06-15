import React, { useEffect } from 'react';

function GoogleAds(props) {
    const { currentPath } = props
    useEffect(() => {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({
            overlays: {bottom: true}
        })
    }, [])
    return (
        <div>
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-8549840240508631"
                data-ad-slot={props.slot}
                data-ad-format="horizontal"
                data-full-width-responsive="true">
            </ins>
        </div>
    );
}
export default GoogleAds;