import AppConstant from '@/constant/app'

function breakpoint() {
  return useBreakpoints<BreakpointType>(AppConstant.THEME.breakpoints)
}

export default breakpoint
