import React from 'react';
import { useScreenType } from '../../shared-hooks/useScreenType';

import BigHeader from './bigHeader';
import SmallHeader from './smallHeader';

const NormalHeader: React.FC = () => {
    const screenType = useScreenType();

    return (
        <>
            {screenType === "desktop" && <BigHeader />}
            {(screenType === "mobile" || screenType === "tablet") && <SmallHeader />}
        </>
    );
};

export default NormalHeader;