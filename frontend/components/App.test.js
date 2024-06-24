import server from '../../backend/mock-server'
import React from 'react'
import AppFunctional from './AppFunctional'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'



jest.setTimeout(1000)

let up, down, left, right, reset, submit
let squares, coordinates, steps, email

const updateStatelessSelectors = document => {
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const updateStatefulSelectors = document => {
  squares = document.querySelectorAll('.square')
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  email = document.querySelector('#email')
}

const testSquares = (squares, activeIdx) => {
  squares.forEach((square, idx) => {
    if (idx === activeIdx) {
      expect(square.textContent).toBe('B')
      expect(square.className).toMatch(/active/)
    } else {
      expect(square.textContent).toBeFalsy()
      expect(square.className).not.toMatch(/active/)
    }
  })
}

test('AppFunctional is a functional component', () => {
  expect(
    AppFunctional.prototype &&
    AppFunctional.prototype.isReactComponent
  ).not.toBeTruthy()
});


describe('AppFunctional', () => {
  beforeAll(() => { server.listen() })
  afterAll(() => { server.close() })
  beforeEach(() => {
    render(<AppFunctional />)
    updateStatelessSelectors(document)
    updateStatefulSelectors(document)
  })
  afterEach(() => {
    server.resetHandlers()
    document.body.innerHTML = ''
  })
  
  describe('[1] All direction buttons work', () => {
      test("[1.1] Moves right once even though right was entered twice", () => {
          fireEvent.click(left);
          fireEvent.click(left);
          testSquares(squares, 3);
      })
      test("[1.2] Moves right once even though right was entered twice", () => {
          fireEvent.click(right);
          fireEvent.click(right);
          testSquares(squares, 5);
      })
      test("[1.3] Can move to the top left corner", () => {
          fireEvent.click(left);
          fireEvent.click(up);
          testSquares(squares, 0);
      })
      test("[1.4] Can move to the bottom right corner", () => {
          fireEvent.click(right);
          fireEvent.click(down);
          testSquares(squares, 8);
      })
      test("[1.5] Can't move past index 0", () => {
          fireEvent.click(left);
          fireEvent.click(up);
          testSquares(squares, 0);
      })
      test("[1.6] Can't move past index 8", () => {
          fireEvent.click(right);
          fireEvent.click(down);
          testSquares(squares, 8);
      })
  })
  describe('[2] The Reset button works', () => {
      test("[2.1] Resets the square position", () => {
          fireEvent.click(right);
          fireEvent.click(down);
          fireEvent.click(reset);
          testSquares(squares, 4);
      })
      test("[2.2] Resets the Coordinates displayed", () => {
          fireEvent.click(right);
          fireEvent.click(down);
          fireEvent.click(reset);
          expect(coordinates.textContent).toMatch("Coordinates (2, 2)");
      })
      test("[2.3] Resets the steps", () => {
          fireEvent.click(right);
          fireEvent.click(down);
          fireEvent.click(reset);
          expect(steps.textContent).toMatch("You moved 0 times");
      })
  })
  describe('[3] Displays the correct coordinates and steps', () => {
      test("[3.1] Displays the correct coordinates for top right corner", () => {
          fireEvent.click(right);
          fireEvent.click(up);
          expect(coordinates.textContent).toMatch("Coordinates (3, 1)");
      })
      test("[3.2] Displays the correct coordinates for top bottom corner", () => {
          fireEvent.click(left);
          fireEvent.click(down);
          expect(coordinates.textContent).toMatch("Coordinates (1, 3)");
      })
      test("[3.3] Displays the correct steps after moving", () => {
          fireEvent.click(left);
          fireEvent.click(up);
          fireEvent.click(right);
          fireEvent.click(down);
          expect(steps.textContent).toMatch("You moved 4 times");
      })
      test("[3.4] Displays the correct steps after hitting a wall", () => {
          fireEvent.click(left);
          fireEvent.click(left);
          expect(steps.textContent).toMatch("You moved 1 time");
      })
  })
  describe('[4] Gives the correct errors for the wrong email', () => {
      test("[4.1] Displays the correct error for a blank input", async () => {
          fireEvent.click(submit)
          await screen.findByText('Ouch: email is required', false, 100)
      })
      test("[4.2] Displays the correct error for an invalid input", async () => {
          fireEvent.change(email, { target: { value: 'no@no' } })
          fireEvent.click(submit)
          await screen.findByText('Ouch: email must be a valid email', false, 100)
      })
  })
  describe('[5] Gives the correct response for the right email', () => {
      test("[5.1] Displays the correct response for one correct email", async () => {
          fireEvent.change(email, { target: { value: 'Joe@mail.com' } })
          fireEvent.click(submit)
          await screen.findByText('Joe win #24', false, 100)
      })
      test("[5.2] Displays the correct response for a second correct email", async () => {
          fireEvent.change(email, { target: { value: '#Mark#&1@mail.com' } })
          fireEvent.click(submit)
          await screen.findByText('#Mark#&1 win #29', false, 100)
      })
  })
})
