import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
import NewEntryForm from './NewEntryForm'

const blog = {
  title: 'testBlog',
  author: 'Mr. Tester',
  url: 'worldoftests.net',
  likes: 59,
  user: {}
}

test('author and title rendered by default, url and likes hidden', () => {
  const component = render(
    <Blog blog={blog} user={{}} />
  )

  expect(component.container).toHaveTextContent(
    'testBlog',
    'Mr. Tester'
  )
  const hiddenContent = component.container.querySelector('.hiddenContent')
  expect(hiddenContent).toHaveStyle('display: none')
  expect(hiddenContent).toHaveTextContent(
    'worldoftests.net',
    59
  )
})

test('clicking entries shows url and likes', () => {
  const component = render(
    <Blog blog={blog} user={{}} />
  )

  const div = component.getByText(/testBlog/)
  div.click()

  const hiddenContent = component.container.querySelector('.hiddenContent')
  expect(hiddenContent).not.toHaveStyle('display: none')
  expect(hiddenContent).toHaveTextContent(
    'worldoftests.net',
    59
  )
})

test('liking twice works as expected', () => {
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={{}} like={mockHandler}/>
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('creating a new entry works as expected', async () => {
  const mockHandler = jest.fn()

  const component = render(
    <NewEntryForm addEntry={mockHandler}/>
  )
  const input1 = component.container.querySelector('#title')
  const input2 = component.container.querySelector('#author')
  const input3 = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(input1, {
    target: { value: 'I Love Frontend Testing' }
  })

  fireEvent.change(input2, {
    target: { value: 'Jaakko Mäki' }
  })

  fireEvent.change(input3, {
    target: { value: 'testtheworld.net' }
  })

  fireEvent.submit(form)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('I Love Frontend Testing')
  expect(mockHandler.mock.calls[0][0].author).toBe('Jaakko Mäki')
  expect(mockHandler.mock.calls[0][0].url).toBe('testtheworld.net')
})



