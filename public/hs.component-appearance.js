window.addEventListener('load', () => {
    function setThemeForIframes (evt) {
        document.querySelectorAll('[data-hs-component-dark-mode]')
            .forEach($toggleEl => {
                const $targetEl = document.querySelector($toggleEl.getAttribute('data-hs-component-dark-mode'))

                if (!$targetEl) return

                const svgEls = $toggleEl.querySelectorAll('[data-svg]')

                if (evt.detail === 'dark') {
                    $targetEl.classList.add('dark')
                    svgEls[0].classList.remove('hidden')
                    svgEls[1].classList.add('hidden')
                    $toggleEl.classList.add('opacity-50')
                } else {
                    $targetEl.classList.remove('dark')
                    svgEls[0].classList.add('hidden')
                    svgEls[1].classList.remove('hidden')
                    $toggleEl.classList.remove('opacity-50')
                }

                if ($targetEl.querySelector('iframe')) {
                    const iDocumnet = $targetEl.querySelector('iframe').contentWindow.document
                    if (evt.detail === 'dark') {
                        iDocumnet.documentElement.classList.add('dark')
                    } else {
                        iDocumnet.documentElement.classList.remove('dark')
                    }
                }
            })
    }

    setThemeForIframes({detail: localStorage.getItem('hs_theme')})

    document.addEventListener('click', evt => {
        const $toggleEl = evt.target.closest('[data-hs-component-dark-mode]')

        if (!$toggleEl) return

        const $targetEl = document.querySelector($toggleEl.getAttribute('data-hs-component-dark-mode'))

        if (!$targetEl || localStorage.getItem('hs_theme') === 'dark') return

        const svgEls = $toggleEl.querySelectorAll('[data-svg]')
        svgEls.forEach($svgEl => $svgEl.classList.toggle('hidden'))

        $targetEl.classList.toggle('dark')

        if ($targetEl.querySelector('iframe')) {
            const iDocumnet = $targetEl.querySelector('iframe').contentWindow.document
            iDocumnet.documentElement.classList.toggle('dark')
        }

        $targetEl.dispatchEvent(
            new CustomEvent('on-hs-appearance-change', { detail: $targetEl.classList.contains('dark') ? 'dark' : 'light' }),
        );
    })

    window.addEventListener('on-hs-appearance-change', evt => setThemeForIframes(evt))
})