import { useMediaQuery } from "react-responsive";

export const useScreenType = () => {
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
    const isMobile = useMediaQuery({ maxWidth: 767 });

    if (isDesktop) {
        return "desktop";
    } else if (isTablet) {
        return "tablet";
    } else if (isMobile) {
        return "mobile";
    }

    return "unknown";
};