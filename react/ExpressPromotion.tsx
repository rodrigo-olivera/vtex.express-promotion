import React, { useState } from 'react'
import { injectIntl } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
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
  active = false,
  buttonHeight = 'auto',
  buttonWidth = 'auto',
  buttonBackgroundColor = 'transparent',
  buttonImage,
  buttonText,
  buttonTextColor,
  products
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const now = new Date()
  const p = products?.filter(({ startDate }) => new Date(startDate).getTime() <= now.getTime())
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).shift() ??
  {
    skuId: null,
    icon: undefined,
    title: null,
    titleB: null,
    endDate: now,
    startDate: new Date().setDate(now.getDate() + 1)
  }

  const [openItem, setOpenItem] = useState(false)
  const { data, error, loading } = useQuery(GET_SKU, {
    variables: {
      value: p.skuId,
    },
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache',
  })

  const startDateI = new Date(p.startDate)
  const endDateI = new Date(p.endDate)

  const showByDate = () => {
    if (!p.endDate && !p.startDate) return true
    if (endDateI > now && startDateI < now) return true
    return false
  }

  if (!data || !data.product || error || !active || loading || !showByDate()) return null

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
        className={`bg-white ${!openItem && 'dn'} 
        ${handles.summaryContainer}`}
      >
        <div className="fl w-100 pa2 vtex-lightning-offer-title">
          {p.icon ? <img className="vtex-logo-offer" src={p.icon} /> : null}
          <span className="vtex-normal-offer">{p.title}</span>
          <span className="vtex-lightning-offer-bold">{p.titleB}</span>
        </div>

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
          id={`product-summary.shelf#express`}
          product={product}
          className="pa6"
        />
      </div>
    </div>
  )
}

//This is the schema form that will render the editable props on SiteEditor
ExpressPromotion.schema = {
  title: 'Express Promotion',
  type: 'object',
  properties: {
    active: {
      title: 'Active',
      type: 'boolean',
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
    products: {
      title: 'Prducts',
      type: "array",
      items: {
        properties: {
          skuId: {
            title: 'SKU ID',
            type: 'number',
          },
          icon: {
            title: 'Icon URL',
            type: 'string',
          },
          title: {
            title: 'Title',
            type: 'string',
          },
          titleB: {
            title: 'Title Bold',
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
          }
        }
      },
    },
  }
}

export default injectIntl(ExpressPromotion)
