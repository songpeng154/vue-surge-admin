import type { MaybeRef } from 'vue'
import type { AutoCompleteProps, CascaderProps, CheckboxGroupProps, CheckboxProps, ColorPickerProps, DatePickerProps, DynamicInputProps, DynamicTagsProps, InputNumberProps, InputProps, MentionProps, RadioGroupProps, RadioProps, RateProps, SelectProps, SliderProps, SwitchProps, TimePickerProps, TransferProps, TreeSelectProps, UploadProps } from 'naive-ui'
import type IconSelector from '@/components/common/icon/icon-selector.vue'

export interface ComponentsProps {
  input?: Partial<InputProps>
  select?: Partial<SelectProps>
  autoComplete?: Partial<AutoCompleteProps>
  cascader?: Partial<CascaderProps>
  colorPicker?: Partial<ColorPickerProps>
  checkbox?: Partial<CheckboxProps>
  checkboxGroup?: Partial<CheckboxGroupProps>
  datePicker?: Partial<DatePickerProps>
  dynamicInput?: Partial<DynamicInputProps>
  dynamicTags?: Partial<DynamicTagsProps>
  inputNumber?: Partial<InputNumberProps>
  mention?: Partial<MentionProps>
  radio?: Partial<RadioProps>
  radioGroup?: Partial<RadioGroupProps>
  rate?: Partial<RateProps>
  slider?: Partial<SliderProps>
  switch?: Partial<SwitchProps>
  timePicker?: Partial<TimePickerProps>
  transfer?: Partial<TransferProps>
  treeSelect?: Partial<TreeSelectProps>
  upload?: Partial<UploadProps>
  iconSelect?: Partial<InstanceType<typeof IconSelector>['$props']>
}

export type ComponentsName = keyof ComponentsProps

export type ComponentsNameRef = MaybeRef<ComponentsName>
