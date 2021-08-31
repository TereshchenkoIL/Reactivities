using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Update
    {
        public class Command : IRequest<Result<Profile>>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Profile>> Handle(Command request, CancellationToken cancellationToken)
            {
                string username = _userAccessor.GetUsername();

                var user = await _context.Users.Include(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == username);

                if (!string.IsNullOrEmpty(request.DisplayName))
                {
                    user.DisplayName = request.DisplayName;
                }

                if (!string.IsNullOrEmpty(request.Bio))
                {
                    user.Bio = request.Bio;
                }

                var result = await _context.SaveChangesAsync() > 0;
                
                if(result) return Result<Profile>.Success(_mapper.Map<AppUser, Profile>(user));
                
                return Result<Profile>.Failure("Problem updating user");
            }
        }
    }
}