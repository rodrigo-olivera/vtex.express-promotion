/* eslint-disable import/no-nodejs-modules */
// eslint-disable-next-line import/no-nodejs-modules
export interface CountdownRibbonProps {
  dueDateTime?: string
  active?: boolean
  text?: string
  buttonURI?: URI
  buttonText?: string
  intl: any
}

export interface product {
  skuId?: number
  icon?: string
  title?: string
  titleB?: string
  endDate: Date
  startDate: Date
}

export interface ExpressPromotionProps {
  active?: boolean = false
  buttonTextColor: string
  buttonHeight: string
  buttonWidth: string
  buttonBackgroundColor: string
  buttonImage: string
  buttonText: string
  products?: product[]
}
