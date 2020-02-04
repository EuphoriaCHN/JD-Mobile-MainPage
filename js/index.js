(function (window, undefined) {
    /**
     * 设置屏幕在滚动时 search 需要改变背景颜色
     */
    function setBannerScrollTransition() {
        let search = document.getElementsByClassName('jd-search')[0];
        let banner = document.getElementsByClassName('jd-banner')[0];

        let bannerHeight = banner.clientHeight;

        window.addEventListener('scroll', function () {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop <= bannerHeight) {
                let alpha = Math.min(1, scrollTop / bannerHeight);
                search.style.backgroundColor = `rgba(233, 35, 34, ${alpha})`;
            } else {
                // 防止滚得太快了来不及慢慢改变
                if (search.style.backgroundColor.startsWith('rgba')) {
                    search.style.backgroundColor = 'rgb(233, 35, 34)';
                }
            }
        });
    }

    window.addEventListener('load', function () {
        setBannerScrollTransition();
    });
})(window, undefined);
