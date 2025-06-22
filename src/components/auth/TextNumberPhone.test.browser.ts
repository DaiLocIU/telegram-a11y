import { nextTick } from 'vue';
import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createVuetify } from 'vuetify';
import TextNumberPhone from './TextNumberPhone.vue';
import { userEvent } from '@vitest/browser/context';

let wrapper: VueWrapper<any>;

function setupComponent(props: Record<string, any> = {}) {
  return mount(TextNumberPhone, {
    global: { plugins: [createVuetify()] },
    props: { ...props },
  });
}


describe('testNumberPhone', () => {
  beforeEach(() => {
    wrapper = setupComponent()
  })
  afterEach(() => {
    // if (wrapper) wrapper.unmount();
  });
  it('renders the label correctly', () => {
    const label = wrapper.find('label.v-field-label');
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe('Your phone number');
  });
  it('show right value when default value is provided', () => {
    wrapper = setupComponent({
      value: '+84',
    });
    const input = wrapper.find('input');
    console.log('input', input.element);
    expect(input.element.value).toBe('+84');
  })
  it('emit update:fullNumber when input changes', async () => {
    const input = wrapper.find('input');

    await userEvent.click(input.element);
    await userEvent.type(input.element, '+84');
    
    await flushPromises();
    await nextTick();
    input.trigger('blur')

    expect(input.element.value).toBe('123456789');
    await nextTick();
    console.log('emmited modelValue', wrapper.emitted('update:modelValue'));
    console.log('emitted modelValue', wrapper.emitted('update:fullNumber'));
    expect(wrapper.emitted('update:fullNumber')?.[0][0]).toBe('+84 123456789');
  })
});