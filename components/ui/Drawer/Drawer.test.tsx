import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('is a labelled dialog when open', () => {
    render(
      <Drawer open title="Transaction details" onClose={() => {}}>
        Body
      </Drawer>
    )
    expect(screen.getByRole('dialog', { name: 'Transaction details' })).toBeInTheDocument()
  })

  it('closes from the close button and Escape, but not from clicks inside the panel', async () => {
    const onClose = vi.fn()
    render(
      <Drawer open title="Details" onClose={onClose}>
        <p>Body</p>
      </Drawer>
    )

    await userEvent.click(screen.getByText('Body'))
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('closes on a backdrop click', async () => {
    const onClose = vi.fn()
    render(
      <Drawer open title="Details" onClose={onClose}>
        Body
      </Drawer>
    )
    await userEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not report a close the parent asked for', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <Drawer open title="Details" onClose={onClose}>
        Body
      </Drawer>
    )
    rerender(
      <Drawer open={false} title="Details" onClose={onClose}>
        Body
      </Drawer>
    )
    expect(onClose).not.toHaveBeenCalled()
  })
})
