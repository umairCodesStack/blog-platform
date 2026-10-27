import type { CollectionConfig } from 'payload'

const isAdmin = ({ req: { user } }: any) => user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'] },
  access: {
    // The first user created through the admin screen becomes admin (see hook below)
    create: isAdmin,
    delete: isAdmin,
    // Public pages read authors through the Local API, so REST stays private
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) =>
      user?.role === 'admin' ? true : user ? { id: { equals: user.id } } : false,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && !req.user) data.role = 'admin'
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Author', value: 'author' },
      ],
      access: { create: isAdmin, update: isAdmin },
    },
    {
      name: 'canPublishDirectly',
      type: 'checkbox',
      defaultValue: false,
      label: 'Can publish without review',
      admin: { description: 'Trusted authors only. Others submit for review.' },
      access: { create: isAdmin, update: isAdmin },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Used in the author URL, e.g. jane-doe' },
    },
    { name: 'bio', type: 'textarea', admin: { description: 'Shown on author page. Real bios help E-E-A-T.' } },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'socials',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
