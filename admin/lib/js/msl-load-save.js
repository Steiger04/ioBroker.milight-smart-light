'use strict'

let vm = null

function load (settings, onChange) {
  vm = createVueInstance(settings, onChange)
  onChange (false)
}

function save (callback) {
  callback (vm.options)
}
