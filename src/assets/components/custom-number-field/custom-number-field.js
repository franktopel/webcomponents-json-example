import CustomField from '../custom-field/custom-field'
import { customNumberFieldStyles as getStyle } from '../../component-styles/styles'

class CustomNumberField extends CustomField {

  static get observedAttributes() {
    return ['json'];
  }

  connectedCallback() {
    console.info('custom-number-field connectedCallback')

    if (!this.hasAttribute('json')) {
      this.setAttribute('json', '{}')
    }

    const id = this.getAttribute('id');
    this.id = id ? id : this.guidGenerator()

    // create HTML-elements 
    this.input = document.createElement('input');
    

    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.info(`custom-number-field attributeChangedCallback ${name} from ${oldValue} to ${newValue}`)
    if (name === 'json') {
      this.updateJSON(newValue)
    }
  }

  updateJSON(json) {
    try {

      if(json == null){
        return;
      }

      if(json){
        if (json.trim().length < 4) {
        // next codeblock should be used instead of the above code
        // if (Object.keys(json).length === 0 && json.constructor === Object) {
          // fail fast ... nothing todo, because empty object
          return
        }
      }

      const obj = JSON.parse(json);

      // console.info('parsing json...')
      this.updateLabel(obj)

      this._setIfValueExists(obj.max, 'max', this.input)
      this._setIfValueExists(obj.min, 'min', this.input)
      this._setBooleanAttrIfValueExists(obj.disabled, 'disabled', this.input, true)
      this._setBooleanAttrIfValueExists(obj.mandatory, 'required', this.input, true)
      this._setBooleanAttrIfValueExists(obj.editable, 'readonly', this.input, false)
      this._setBooleanAttrIfValueExists(obj.visible, 'hidden', this, false)

      if (obj.value != undefined) {
        this.input.value = obj.value
      }

      if (obj.commands != undefined) {
        const currentThis = this;
        obj.commands.forEach((command) => currentThis._handleCommand(command))
      }


    } catch (err) {
      console.warn(`invalid json: ${err}`)
    }
  }

  _setBooleanAttrIfValueExists(value, attribute, obj, valueShouldBe) {
    if (value != undefined) {
      if (value == valueShouldBe) {
        obj.setAttribute(attribute, attribute)
      } else {
        obj.removeAttribute(attribute)
      }
    }
  }

  _setIfValueExists(value, attribute, obj) {
    if (value != undefined) {
      obj.setAttribute(attribute, value)
    }
  }

  _handleCommand(command) {
    if (command == undefined) {
      // fail fast nothing to do
      return
    }
    switch (command) {
      case 'focus':

        if (
          !this.input.hasAttribute('readonly')
          || !this.input.hasAttribute('disabled')
          || !this.input.hasAttribute('hidden')
        ) {
          this.input.focus();
        }

        break;
      default:
        break;
    }
  }

  _addStyle() {
    const styleTag = document.createElement('style')
    styleTag.textContent = getStyle
    this.shadow.appendChild(styleTag)
  }

  _getDelegate(){
    return this.input;
  }

  // maybe use templates instead
  _render() {
    super._render()
    this._addStyle()

    // configure input
    this.input.setAttribute('type', 'number')
    this.input.setAttribute('min', '10')
    this.input.setAttribute('max', '15')
    this.input.setAttribute('id', `${this.id}-delegate`)
    // configure label
    this.label.setAttribute('for', `${this.id}-delegate`)
    this.label.innerText = 'labeltext'
    this.root.appendChild(this._getDelegate())
    this.root.appendChild(this.label)
    this._handleLabelOrientation('west')

    // append to div
    //this.delegateContainer.appendChild(this.input) 

  }
}

customElements.define('custom-number-field', CustomNumberField)
