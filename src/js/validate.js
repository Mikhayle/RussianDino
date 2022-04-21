const validate = document.querySelector('.js-validate')
if (validate) {
  if (validate) {
    const validation = new JustValidate(validate)
    validation.addField('#user-mail', [
      {
        rule: 'required',
        errorMessage: 'Электронная почта обязательна',
      },
      {
        rule: 'email',
        errorMessage: 'Электронная почта недействительна',
      },
    ])
  }

  const inputsNew = [].slice.call(document.querySelectorAll('.new-input'))
  const buttonNew = document.querySelector('.new-offer__btn')

  inputsNew.forEach((el) => {
    el.addEventListener('input', checkInputs, false)
  })

  function checkInputs() {
      const empty = inputsNew.filter((e) => {
        return e.value.trim() === ''
      }).length
      buttonNew.disabled = empty !== 0
    }
  checkInputs()


  const inputFeedback = [].slice.call(document.querySelectorAll('.feedback-input'))
  const buttonsFeedback = document.querySelector('.feedback__btn')

  inputFeedback.forEach((el) => {
    el.addEventListener('input', checkInput, false)
  })
  // const feedback = document.querySelector('.feedback-consent')
  // const input = document.querySelector('.feedback-details__input')

  // feedback.addEventListener('click', () => {
  //   setTimeout(() => {
  //   if (input.checked) {
  //     input.checked = false
  //   } else {
  //     input.checked = true
  //   }
  // }, 300);
  // })
  const agreementCheckbox = document.querySelector('#input-checkbox')
  agreementCheckbox.addEventListener('click', checkInput)

  function checkInput() {
    const empty = inputFeedback.filter((e) => {
      return e.value.trim() === ''
    }).length
    console.log(agreementCheckbox.checked)
    buttonsFeedback.disabled = empty !== 0 || !agreementCheckbox.checked
  }
  checkInput()
  const validates = document.querySelector('.js-validates')
  if (validates) {
    const validation = new JustValidate(validates)
    validation.addField('#user-name', [
      {
        rule: 'required',
        errorMessage: 'Поле Имя не может быть пустым',
      },
    ]),
      // validation.addField('#user-phone', [
      //   {
      //     rule: 'customRegexp',
      //     value: /((\+7|7|8)+([0-9]){10})$/,
      //     errorMessage: 'Некорректный номер телефона',
      //   },
      // ]),
      validation.addField('#input-checkbox', [
        {
          rule: 'required',
          errorMessage: 'Согласие обязательно при отправке данных!',
        },
      ])
  }
}
