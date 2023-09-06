import InputSettingItem from './Input'
import SelectSettingItem from './Select'
import SliderSettingItem from './Slider'
import SwitchSettingItem from './Switch'
import {
  isSelectSettingItem,
  isInputSettingItem,
  isSwitchSettingItem,
  isSliderSettingItem,
} from './types'

const SettingItem: React.FC<SettingItemProps> = (props) => {
  const { item, ...otherProps } = props
  if (isSelectSettingItem(item)) return <SelectSettingItem item={item} {...otherProps} />

  if (isInputSettingItem(item)) return <InputSettingItem item={item} {...otherProps} />

  if (isSwitchSettingItem(item)) return <SwitchSettingItem item={item} {...otherProps} />

  if (isSliderSettingItem(item)) return <SliderSettingItem item={item} {...otherProps} />

  return <></>
}

export interface SettingItemProps<T = Setting.SettingItem> {
  item: T
  itemKey: string
  itemParentKey: string
  categoryKey: string
}

export default SettingItem
