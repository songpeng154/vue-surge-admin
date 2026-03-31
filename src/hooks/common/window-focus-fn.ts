function useWindowFocusFn(callback: (isFocus: boolean) => any) {
  const isFocus = useWindowFocus()

  watch(isFocus, callback)
}

export default useWindowFocusFn
