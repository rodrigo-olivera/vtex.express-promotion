/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-console */
import React, { useState } from 'react'
import { injectIntl } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
//import { useDevice } from 'vtex.device-detector'
import { ExpressPromotionProps } from './typings/global'
import GET_SKU from './graphql/getSku.graphql'
import { ButtonWithIcon, IconClose } from 'vtex.styleguide'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { ExtensionPoint } from 'vtex.render-runtime'

//Declare Handles for the react component to be accesible
const CSS_HANDLES = [
  'container',
  'openButton',
  'summaryContainer',
  'title',
  'closeButton',
] as const

const ExpressPromotion: StorefrontFunctionComponent<ExpressPromotionProps> = ({
  buttonHeight = 'auto',
  buttonWidth = 'auto',
  buttonBackgroundColor = 'transparent',
  buttonImage,
  buttonText,
  buttonTextColor,
  skuId,
  title,
  active = false,
  endDate,
  startDate,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  //const { isMobile } = useDevice()

  const [openItem, setOpenItem] = useState(false)
  const { data, error, loading } = useQuery(GET_SKU, {
    variables: {
      value: skuId,
    },
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
  })

  const now = new Date()
  const startDateI = new Date(startDate)
  const endDateI = new Date(endDate)

  const showByDate = () => {
    if (!endDate && !startDate) return true
    if (endDateI > now && startDateI < now) return true
    return false
  }

  if (!data || error || !active || loading || !showByDate()) return null

  const item = data.product

  const product = ProductSummary.mapCatalogProductToProductSummary(item)

  const toggle = () => {
    setOpenItem(!openItem)
  }

  return (
    <div className={`fixed z-999 left-0 bottom-0 ${handles.container}`}>
      <div className={`pa2 ${openItem && 'dn'} ${handles.openButton}`}>
        <button
          className={`w4 h-auto`} 
          onClick={toggle}
          style={{
            border: 'none',
            background: buttonBackgroundColor,
            color: buttonTextColor,
            width: buttonWidth,
            height: buttonHeight,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <div><img src={buttonImage} alt="" /></div>
          <div><span>{buttonText}</span></div>
        </button>
      </div>
      <div
        className={`bg-white pa6 ${!openItem && 'dn'} 
        ${handles.summaryContainer}`}
      >
        <span className={`${handles.title}`}>{title}</span>
        <div
          className={`absolute z-999 top-0 right-0 pa2 ${handles.closeButton}`}
        >
          <ButtonWithIcon
            icon={<IconClose />}
            variation="tertiary"
            onClick={toggle}
          />
        </div>
        <ExtensionPoint
          id={`product-summary.shelf`}
          product={product}
          className="pa6"
        />
      </div>
    </div>
  )
}

//const messages = defineMessages({})

//This is the schema form that will render the editable props on SiteEditor
ExpressPromotion.schema = {
  title: 'Express Promotion',
  type: 'object',
  properties: {
    active: {
      title: 'Active',
      type: 'boolean',
    },
    skuId: {
      title: 'SKU ID',
      type: 'number',
    },
    title: {
      title: 'Title',
      type: 'string',
    },
    startDate: {
      title: 'Start Date',
      type: 'string',
      format: 'date-time',
    },
    endDate: {
      title: 'End Date',
      type: 'string',
      format: 'date-time',
    },
    buttonHeight: {
      title: 'Button Height',
      type: 'string',
    },
    buttonWidth: {
      title: 'Button Width',
      type: 'string',
    },
    buttonBackgroundColor: {
      title: 'Button Background Color',
      type: 'string',
    },
    buttonText: {
      title: 'Buton Text',
      type: 'string',
    },
    buttonTextColor: {
      title: 'Buton Text Color',
      type: 'string',
    },
  },
}

export default injectIntl(ExpressPromotion)
