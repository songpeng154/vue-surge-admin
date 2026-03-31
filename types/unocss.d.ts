import 'unocss'

declare module 'unocss' {
  interface Theme {
    // 文字颜色
    textColor: TextColor

    // 背景颜色
    backgroundColor: BackgroundColor

    // 边框颜色
    borderColor: ThemeBorderColor

    // 填充颜色
    fillColor: ThemeFillColor
  }
}
