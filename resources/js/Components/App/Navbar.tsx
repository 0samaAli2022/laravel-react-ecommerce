import { Link, useForm, usePage } from '@inertiajs/react';
import MiniCartDropdown from '@/Components/App/MiniCartDropdown';
import { FormEventHandler } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const { auth, departments, keyword } = usePage().props;
  const { url } = usePage();

  const searchForm = useForm({
    keyword: keyword || ''
  });
  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    searchForm.get(url, {
      preserveScroll: true,
      preserveState: true
    });
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            LaraStore
          </Link>
        </div>
        <div className="flex gap-4">
          <form onSubmit={onSubmit} className={'join flex-1'}>
            <div className="join-item flex-1">
              <input
                type="search"
                name="search"
                value={searchForm.data.keyword}
                onChange={(e) =>
                  searchForm.setData('keyword', e.target.value)}
                className="input input-bordered join-item w-full"
                placeholder="Search..."
              />
            </div>
            <div className="indicator">
              <button className="btn join-item" type="submit">
                <MagnifyingGlassIcon className="size-4" />
              </button>
            </div>
          </form>
          <MiniCartDropdown />
          {auth.user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link href={route('profile.edit')} className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href={route('logout')} method={'post'} as="button">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href={route('login')} className="btn ">
                Login
              </Link>
              <Link href={route('register')} className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="navbar bg-base-100 border-gray-500 bordert-t min-h-4">
        <div className="navbar-center hideden lg:flex">
          <ul className="menu menu-horizontal menu-dropdown dropdown-hover px-1 z-20 py-0">
            {departments.map((department) => (
              <li key={department.id}>
                <Link href={route('product.byDepartment', department.slug)}>
                  {department.name}
                </Link>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </>
  );
}

export default Navbar;
